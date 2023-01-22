import React, { Component } from 'react';
import { PayrollEmployeeList } from './PayrollEmployeeList';
import { PayrollEmployee } from './PayrollEmployee';

export class Layout extends Component {
  static displayName = Layout.name;

    // eslint-disable-next-line no-useless-constructor
  constructor (props) {
    super(props);
    this.state = {
      showlist: true,
      currentid: 0
    };
  }

  handleCallback = (newvalue, id) => {
    this.setState({
      showlist: newvalue,
      currentid: id
    })
  }

  getParentState = () => {
    return this.state.currentid;
  }

  render () {
    return (
      <div className="maindiv">
        <h2>Payroll Benfits</h2>
        <hr></hr><br></br>
        <div className={this.state.showlist ? null : "hidden"}>
          <PayrollEmployeeList parentCallback={this.handleCallback}></PayrollEmployeeList>
        </div>
        <div className={!this.state.showlist ? null : "hidden"}>
          <PayrollEmployee getParentState={this.getParentState} parentCallback={this.handleCallback}></PayrollEmployee>
        </div>
      </div>
    );
  }
}
