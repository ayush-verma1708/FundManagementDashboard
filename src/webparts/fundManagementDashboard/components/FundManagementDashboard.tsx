import * as React from 'react';
import type { IFundManagementDashboardProps } from './IFundManagementDashboardProps';
import { getSP } from "./Spfx_sp.config";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { CSSProperties } from 'react';

interface IInvestorJourneyState {
  usernames: string[];
  selectedUsername: string;
  investorDetails: any[];
}

export default class FundManagementDashboard extends React.Component<IFundManagementDashboardProps, IInvestorJourneyState> {
  private _sp: SPFI;

  constructor(props: IFundManagementDashboardProps) {
    super(props);
    this.state = { 
      usernames: [], 
      selectedUsername: '', 
      investorDetails: [] 
    };
    this._sp = getSP();
  }

  componentDidMount() {
    this.fetchUsernames();
  }

  fetchUsernames = async () => {
    try {
      const items: any[] = await this._sp.web.lists.getByTitle("InvestorJourney").items.select("username")();
      const usernames = items.map(item => item.username);
      this.setState({ usernames });
    } catch (error) {
      console.error("An error occurred while fetching usernames:", error);
    }
  }

  handleUsernameChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUsername = event.target.value;
    this.setState({ selectedUsername });
    if (selectedUsername) {
      this.getInvestorJourneyDetails(selectedUsername);
    }
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
    const { investorDetails } = this.state;
    const newInvestorDetails = [...investorDetails];
    newInvestorDetails[index][field] = event.target.value;
    this.setState({ investorDetails: newInvestorDetails });
  }

  private getInvestorJourneyDetails = async (username: string) => {
    try {
      const investorJourney: any[] = await this._sp.web.lists
        .getByTitle("InvestorJourney")
        .items
        .filter(`username eq '${username}'`)
        .select(
          "ID",
          "Title",
          "username",
          "EmailID",
          "CompanyName",
          "ShortlistedCompany",
          "InvestorFormFilled",
          "PaymentFormFilled",
          "PaymentDone",
          "DocumentsSent",
          "DocumentSigned",
          "FundManager",
          "AmountPaid"
        )();

      this.setState({ investorDetails: investorJourney });
    } catch (error) {
      console.error("An error occurred while fetching the item:", error);
      alert("An error occurred while fetching the items.");
    }
  }

  handleSubmit = async (item: any) => {
    if (isNaN(Number(item.AmountPaid))) {
      alert("Please enter a valid number for Amount Paid.");
      return;
    }

    try {
      await this._sp.web.lists.getByTitle("InvestorJourney").items.getById(item.ID).update({
        InvestorFormFilled: item.InvestorFormFilled,
        PaymentFormFilled: item.PaymentFormFilled,
        PaymentDone: item.PaymentDone,
        DocumentsSent: item.DocumentsSent,
        DocumentSigned: item.DocumentSigned,
        AmountPaid: item.AmountPaid
      });
      alert("Data updated successfully.");
    } catch (error) {
      console.error("An error occurred while updating data:", error);
      alert("An error occurred while updating data.");
    }
  }

  handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
    const { investorDetails } = this.state;
    const newInvestorDetails = [...investorDetails];
    newInvestorDetails[index][field] = event.target.checked ? "Yes" : "No";
    this.setState({ investorDetails: newInvestorDetails });
  }

  public render(): React.ReactElement<IFundManagementDashboardProps> {
    const { usernames, selectedUsername, investorDetails } = this.state;

    const displayLabels: { [key: string]: string } = {
      DocumentsSent: "Send Document",
      InvestorFormFilled: "Investor Form Filled",
      PaymentFormFilled: "Payment Form Filled",
      PaymentDone: "Payment Done",
      DocumentSigned: "Document Signed",
      AmountPaid: "Amount Paid"
    };

    this._sp.web.currentUser().then((user) => {
      const email = user.Email;
      if (email !== "GSHadmin@GrowSecureHolding.onmicrosoft.com") {
        console.log(email);
        return null;
      }
    });

    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Fund Manager Dashboard</h1>
        <div style={styles.selectContainer}>
          <label htmlFor="usernameSelect" style={styles.label}>Select Username:</label>
          <select
            id="usernameSelect"
            value={selectedUsername}
            onChange={this.handleUsernameChange}
            style={styles.select}
          >
            <option value="">Select a username</option>
            {usernames.map((username, index) => (
              <option key={index} value={username}>{username}</option>
            ))}
          </select>
        </div>
        <div id="allItems">
          {investorDetails.length > 0 ? investorDetails.map((item, index) => (
            <div key={index} style={styles.card}>
              <h2 style={styles.cardHeader}>{item.Title}</h2>
              <table style={styles.table}>
                {["FundManager", "username", "EmailID", "CompanyName", "ShortlistedCompany"].map(element => (
                  item.hasOwnProperty(element) && (
                    <tr key={element} style={styles.tableRow}>
                      <td style={styles.tableCellLabel}>{element}</td>
                      <td style={styles.tableCellValue}>{item[element] === undefined || item[element] === null ? "NA" : item[element]}</td>
                    </tr>
                  )
                ))}
                {["InvestorFormFilled", "PaymentFormFilled", "PaymentDone", "DocumentsSent", "DocumentSigned"].map(field => (
                  <>
                    <tr key={field} style={styles.tableRow}>
                      <td style={styles.tableCellLabel}>{displayLabels[field]}</td>
                      <td style={styles.tableCellValue}>
                        <input
                          type="checkbox"
                          checked={item[field] === "Yes"}
                          onChange={(e) => this.handleCheckboxChange(e, index, field)}
                          style={styles.checkbox}  // Apply styles to the checkbox
                        />
                      </td>
                    </tr>
                    {field === "PaymentDone" && (
                      <tr key="AmountPaid" style={styles.tableRow}>
                        <td style={styles.tableCellLabel}>{displayLabels.AmountPaid}</td>
                        <td style={styles.tableCellValue}>
                          <input
                            type="text"
                            value={item.AmountPaid || ""}
                            onChange={(e) => this.handleInputChange(e, index, "AmountPaid")}
                            style={styles.input}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </table>
              <button
                onClick={() => this.handleSubmit(item)}
                style={styles.button}
              >
                Submit
              </button>
            </div>
          )) : <p style={styles.noData}>No data found for the selected username.</p>}
        </div>
      </div>
    );
  }
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  selectContainer: {
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginRight: '10px',
    fontSize: '18px'
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minWidth: '200px'
  },
  card: {
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    position: 'relative'
  },
  cardHeader: {
    fontSize: '20px',
    marginBottom: '10px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  tableRow: {
    borderBottom: '1px solid #ddd'
  },
  tableCellLabel: {
    padding: '8px',
    textAlign: 'left',
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9'
  },
  tableCellValue: {
    padding: '8px',
    textAlign: 'left'
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%'
  },
  button: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#0078d4',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  noData: {
    textAlign: 'center' as 'center',
    fontSize: '18px',
    color: '#666'
  },
  checkbox: {
    width: '20px',
    height: '20px'
  }
};
