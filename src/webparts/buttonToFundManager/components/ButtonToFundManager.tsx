import * as React from 'react';
import styles from './ButtonToFundManager.module.scss';
import type { IButtonToFundManagerProps } from './IButtonToFundManagerProps';
// import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { getSP } from "./Spfx_sp.config";
import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";

export default class ButtonToFundManager extends React.Component<IButtonToFundManagerProps, { canAccess: boolean }> {
  private _sp: SPFI;
  constructor(props: IButtonToFundManagerProps) {
    super(props);
    this.state = { canAccess: false };
    this._sp = getSP();
  }

  public componentDidMount() {
    this.getCurrentUserEmail();
  }

  private getCurrentUserEmail = async () => {
    try {
      const user = await this._sp.web.currentUser();

      const currentUserEmail: string = user.Email;

      if (currentUserEmail.toLowerCase() === 'gshadmin@growsecureholding.onmicrosoft.com') {
        this.setState({ canAccess: true });
      }
    } catch (error) {
      console.error('Error fetching current user email:', error);
    }
  };

  public render(): React.ReactElement<{}> | null {
    if (!this.state.canAccess) {
      return null;
    }
  
    return (
      <section className={styles.buttonToFundManager}>
        <button onClick={this.redirectToDashboard}>
          Go to Fund Management Dashboard
        </button>
      </section>
    );
  }
  

  private redirectToDashboard = () => {
    window.location.href = 'https://growsecureholding.sharepoint.com/sites/GSHPortfolio/SitePages/Fund-Management-Dashboard.aspx';
  };
}
