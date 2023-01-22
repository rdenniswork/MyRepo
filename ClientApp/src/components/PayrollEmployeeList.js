import React, { Component } from 'react';
import axios from 'axios';

export class PayrollEmployeeList extends Component {
  static displayName = PayrollEmployeeList.name;
  
  // eslint-disable-next-line no-useless-constructor
  constructor (props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.LoadData();
  }
  
  LoadData = () => {
    let config = {
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'contentType': 'application/json',
      }
    }

    axios
    .get("http://localhost:52688/Payroll/Employee/Get", config)
    .then(data => 
      { 
        const employeeList = (
          <ul className="ul.no-bullets">
            {data.data.map((employee) =>
              <li key={employee.id}>
                <input type="button" value="Edit" title="Edit Employee" className="btn-primary"
                  onClick={() => this.Edit(employee.id)}></input>
                <input type="button" value="Delete" title="Delete Employee" className="btn-primary"
                  onClick={() => this.Delete(employee.id)}></input>
                {employee.firstName} {employee.lastName}
              </li>
            )}
          </ul>
        );
        this.setState({
          value: employeeList
        });
      })
    .catch(error => console.log(error));
  }

  Edit = (id) => {
    this.props.parentCallback(false, id);
  }

  New = (id) => {
    this.Edit(0)
  }

  Delete= (id) => {
    let config = {
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'contentType': 'application/json',
      }
    }

    axios
    .get("http://localhost:52688/Payroll/Employee/Delete/" + id.toString(), config)
    .then(data => 
      { 
        this.LoadData()
      })
    .catch(error => console.log(error));
  }
 
  render () {
    return (
      <div onChange={this.LoadData()}>
          <h2>Employee List</h2>
          <div>
          {this.state.value}
          </div>
          <br></br><br></br>
          <input type="button" value="New" title="Add New Employee" className="btn-primary" onClick={this.New}></input>
          <br></br>
      </div>
    );
  }
}
