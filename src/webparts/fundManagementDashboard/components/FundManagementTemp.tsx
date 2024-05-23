// import * as React from 'react';
// import type { IFundManagementDashboardProps } from './IFundManagementDashboardProps';
// import { getSP } from "./Spfx_sp.config";
// import { SPFI } from "@pnp/sp";
// import "@pnp/sp/webs";
// import "@pnp/sp/lists";
// import "@pnp/sp/items";
// import "@pnp/sp/site-users/web";

// interface IInvestorJourneyState {
//   usernames: string[];
//   selectedUsername: string;
//   investorDetails: any[];
// }

// export default class FundManagementDashboard extends React.Component<IFundManagementDashboardProps, IInvestorJourneyState> {
//   private _sp: SPFI;

//   constructor(props: IFundManagementDashboardProps) {
//     super(props);
//     this.state = { 
//       usernames: [], 
//       selectedUsername: '', 
//       investorDetails: [] 
//     };
//     this._sp = getSP();
//   }

//   componentDidMount() {
//     this.fetchUsernames();
//   }

//   fetchUsernames = async () => {
//     try {
//       const items: any[] = await this._sp.web.lists.getByTitle("InvestorJourney").items.select("username")();
//       const usernames = items.map(item => item.username);
//       this.setState({ usernames });
//     } catch (error) {
//       console.error("An error occurred while fetching usernames:", error);
//     }
//   }

//   handleUsernameChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedUsername = event.target.value;
//     this.setState({ selectedUsername });
//     if (selectedUsername) {
//       this.getInvestorJourneyDetails(selectedUsername);
//     }
//   }

//   handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
//     const { investorDetails } = this.state;
//     const newInvestorDetails = [...investorDetails];
//     newInvestorDetails[index][field] = event.target.value;
//     this.setState({ investorDetails: newInvestorDetails });
//   }

//   private getInvestorJourneyDetails = async (username: string) => {
//     try {
//       const investorJourney: any[] = await this._sp.web.lists
//         .getByTitle("InvestorJourney")
//         .items
//         .filter(`username eq '${username}'`)
//         .select(
//           "ID",
//           "Title",
//           "username",
//           "EmailID",
//           "CompanyName",
//           "ShortlistedCompany",
//           "InvestorFormFilled",
//           "PaymentFormFilled",
//           "PaymentDone",
//           "DocumentsSent",
//           "DocumentSigned",
//           "FundManager"
//         )();

//       this.setState({ investorDetails: investorJourney });
//     } catch (error) {
//       console.error("An error occurred while fetching the item:", error);
//       alert("An error occurred while fetching the items.");
//     }
//   }

//   handleSubmit = async (item: any) => {
//     try {
//       await this._sp.web.lists.getByTitle("InvestorJourney").items.getById(item.ID).update({
//         InvestorFormFilled: item.InvestorFormFilled,
//         PaymentFormFilled: item.PaymentFormFilled,
//         PaymentDone: item.PaymentDone,
//         DocumentsSent: item.DocumentsSent,
//         DocumentSigned: item.DocumentSigned
//       });
//       alert("Data updated successfully.");
//     } catch (error) {
//       console.error("An error occurred while updating data:", error);
//       alert("An error occurred while updating data.");
//     }
//   }

//   handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, field: string) => {
//     const { investorDetails } = this.state;
//     const newInvestorDetails = [...investorDetails];
//     newInvestorDetails[index][field] = event.target.checked ? "Yes" : "No";
//     this.setState({ investorDetails: newInvestorDetails });
//   }

//   public render(): React.ReactElement<IFundManagementDashboardProps> {
//     const { usernames, selectedUsername, investorDetails } = this.state;

//     const displayLabels: { [key: string]: string } = {
//       DocumentsSent: "Send Document",
//       InvestorFormFilled: "Investor Form Filled",
//       PaymentFormFilled: "Payment Form Filled",
//       PaymentDone: "Payment Done",
//       DocumentSigned: "Document Signed",
//     };

//     this._sp.web.currentUser().then((user) => {
//       const email = user.Email;
//       if (email !== "GSHadmin@GrowSecureHolding.onmicrosoft.com") {
//         // Don't render anything if the emailId does not match
//         console.log(email);
//         return null;
//       }
//     });

//     return (
//       <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//         <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Fund Manager Dashboard</h1>
//         <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
//           <label htmlFor="usernameSelect" style={{ marginRight: '10px', fontSize: '18px' }}>Select Username:</label>
//           <select
//             id="usernameSelect"
//             value={selectedUsername}
//             onChange={this.handleUsernameChange}
//             style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '200px' }}
//           >
//             <option value="">Select a username</option>
//             {usernames.map((username, index) => (
//               <option key={index} value={username}>{username}</option>
//             ))}
//           </select>
//         </div>
//         <div id="allItems">
//           {investorDetails.length > 0 ? investorDetails.map((item, index) => (
//             <div key={index} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', position: 'relative' }}>
//               <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{item.Title}</h2>
//               <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                 {["FundManager", "username", "EmailID", "CompanyName", "ShortlistedCompany"].map(element => (
//                   item.hasOwnProperty(element) && (
//                     <tr key={element} style={{ borderBottom: '1px solid #ddd' }}>
//                       <td style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>{element}</td>
//                       <td style={{ padding: '8px', textAlign: 'left' }}>{item[element] === undefined || item[element] === null ? "NA" : item[element]}</td>
//                     </tr>
//                   )
//                 ))}
//                 {["InvestorFormFilled", "PaymentFormFilled", "PaymentDone", "DocumentsSent", "DocumentSigned"].map(field => (
//                   <tr key={field} style={{ borderBottom: '1px solid #ddd' }}>
//                     <td style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>{displayLabels[field]}</td>
//                     <td style={{ padding: '8px', textAlign: 'left' }}>
//                       <input
//                         type="checkbox"
//                         checked={item[field] === "Yes"}
//                         onChange={(e) => this.handleCheckboxChange(e, index, field)}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </table>
//               <button
//                 onClick={() => this.handleSubmit(item)}
//                 style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px 20px', fontSize: '16px', backgroundColor: '#0078d4', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//               >
//                 Submit
//               </button>
//             </div>
//           )) : <p>No data found for the selected username.</p>}
//         </div>
//       </div>
//     );
//   }
// }
import * as React from 'react';
import type { IFundManagementDashboardProps } from './IFundManagementDashboardProps';
import { getSP } from "./Spfx_sp.config";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

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
          "FundManager"
        )();

      this.setState({ investorDetails: investorJourney });
    } catch (error) {
      console.error("An error occurred while fetching the item:", error);
      alert("An error occurred while fetching the items.");
    }
  }

  handleSubmit = async (item: any) => {
    try {
      await this._sp.web.lists.getByTitle("InvestorJourney").items.getById(item.ID).update({
        InvestorFormFilled: item.InvestorFormFilled,
        PaymentFormFilled: item.PaymentFormFilled,
        PaymentDone: item.PaymentDone,
        DocumentsSent: item.DocumentsSent,
        DocumentSigned: item.DocumentSigned
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
    };

    this._sp.web.currentUser().then((user) => {
      const email = user.Email;
      if (email !== "GSHadmin@GrowSecureHolding.onmicrosoft.com") {
        // Don't render anything if the emailId does not match
        console.log(email);
        return null;
      }
    });

    return (
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Fund Manager Dashboard</h1>
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <label htmlFor="usernameSelect" style={{ marginRight: '10px', fontSize: '18px' }}>Select Username:</label>
          <select
            id="usernameSelect"
            value={selectedUsername}
            onChange={this.handleUsernameChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '200px' }}
          >
            <option value="">Select a username</option>
            {usernames.map((username, index) => (
              <option key={index} value={username}>{username}</option>
            ))}
          </select>
        </div>
        <div id="allItems">
          {investorDetails.length > 0 ? investorDetails.map((item, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', position: 'relative', paddingBottom: '60px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{item.Title}</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                {["FundManager", "username", "EmailID", "CompanyName", "ShortlistedCompany"].map(element => (
                  item.hasOwnProperty(element) && (
                    <tr key={element} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>{element}</td>
                      <td style={{ padding: '8px', textAlign: 'left' }}>{item[element] === undefined || item[element] === null ? "NA" : item[element]}</td>
                    </tr>
                  )
                ))}
                {["InvestorFormFilled", "PaymentFormFilled", "PaymentDone", "DocumentsSent", "DocumentSigned"].map(field => (
                  <tr key={field} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>{displayLabels[field]}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>
                      <input
                        type="checkbox"
                        checked={item[field] === "Yes"}
                        onChange={(e) => this.handleCheckboxChange(e, index, field)}
                      />
                    </td>
                  </tr>
                ))}
              </table>
              <button
                onClick={() => this.handleSubmit(item)}
                style={{ position: 'absolute', bottom: '10px', right: '10px', padding: '10px 20px', fontSize: '16px', backgroundColor: '#0078d4', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Submit
              </button>
            </div>
          )) : <p>No data found for the selected username.</p>}
        </div>
      </div>
    );
  }
}
