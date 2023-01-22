import React, { Component } from 'react';
import axios from 'axios';

export class PayrollEmployee extends Component {
  static displayName = PayrollEmployee.name;
  
  // eslint-disable-next-line no-useless-constructor
  constructor (props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  LoadData = (id) => {
    let config = {
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'contentType': 'application/json',
      }
    }

    axios
    .get("http://localhost:52688/Payroll/Employee/Get/" + id.toString(), config)
    .then(data => 
      { 
        document.getElementById("fname").setAttribute("data-id", "");
        document.getElementById("fname").value = "";
        document.getElementById("lname").value = "";
        document.getElementById("fname1").setAttribute("data-id", "");
        document.getElementById("fname1").value = "";
        document.getElementById("lname1").value = "";
        document.getElementById("fname2").setAttribute("data-id", "");
        document.getElementById("fname2").value = "";
        document.getElementById("lname2").value = "";
        document.getElementById("fname3").setAttribute("data-id", "");
        document.getElementById("fname3").value = "";
        document.getElementById("lname3").value = "";
        if (data.data !== "") {
          document.getElementById("fname").setAttribute("data-id", data.data.id);
          document.getElementById("fname").value = data.data.firstName;
          document.getElementById("lname").value = data.data.lastName;
          document.getElementById("fname1").value = (data.data.dependants[0] && (data.data.dependants[0].id)) ? document.getElementById("fname1").setAttribute("data-id", data.data.dependants[0].id) : "0";
          document.getElementById("fname1").value = (data.data.dependants[0]) ? data.data.dependants[0].firstName : "";
          document.getElementById("lname1").value = (data.data.dependants[0]) ? data.data.dependants[0].lastName : "";
          document.getElementById("fname2").value = (data.data.dependants[1] && (data.data.dependants[1].id)) ? document.getElementById("fname2").setAttribute("data-id", data.data.dependants[1].id) : "0";
          document.getElementById("fname2").value = (data.data.dependants[1]) ? data.data.dependants[1].firstName : "";
          document.getElementById("lname2").value = (data.data.dependants[1]) ? data.data.dependants[1].lastName : "";
          document.getElementById("fname3").value = (data.data.dependants[2] && (data.data.dependants[2].id)) ? document.getElementById("fname3").setAttribute("data-id", data.data.dependants[2].id) : "0";
          document.getElementById("fname3").value = (data.data.dependants[2]) ? data.data.dependants[2].firstName : "";
          document.getElementById("lname3").value = (data.data.dependants[2]) ? data.data.dependants[2].lastName : "";
        }

        this.CalculateBenfitsCost();
      })
    .catch(error => console.log(error));    
  }
  
  Save = () => {
    let config = {
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'contentType': 'application/json',
      }
    }

    let model = { 
      employee: { 
        Id: document.getElementById("fname").getAttribute("data-id") ? document.getElementById("fname").getAttribute("data-id") : "0",
        FirstName: (document.getElementById("fname")).value, 
        LastName: (document.getElementById("lname")).value }, 
      employeeDependents: [
        {  Id: document.getElementById("fname1").getAttribute("data-id") ? document.getElementById("fname1").getAttribute("data-id") : "0",
           FirstName: (document.getElementById("fname1")).value, 
           LastName: (document.getElementById("lname1")).value },
        {  Id: document.getElementById("fname2").getAttribute("data-id") ? document.getElementById("fname2").getAttribute("data-id") : "0",
           FirstName: (document.getElementById("fname2")).value, 
           LastName: (document.getElementById("lname2")).value },
        {  Id: document.getElementById("fname3").getAttribute("data-id") ? document.getElementById("fname3").getAttribute("data-id") : "0", 
           FirstName: (document.getElementById("fname3")).value, 
           LastName: (document.getElementById("lname3")).value }
       ] 
    }    

    let urlstring = ""
    if (model.employee.Id === "" || model.employee.Id === '0') {
      urlstring = "http://localhost:52688/Payroll/Employee/Add";
    }
    else {
      urlstring = "http://localhost:52688/Payroll/Employee/Update";
    }

    axios
    .post(urlstring, model, config)
    .then(data => 
      { 
        this.props.parentCallback(true, 0);
      })
    .catch(error => console.log(error));
  }

  CalculateBenfitsCost = () => {
    let config = {
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'contentType': 'application/json',
      }
    }

    let model = { 
      employee: { 
        FirstName: (document.getElementById("fname")).value, 
        LastName: (document.getElementById("lname")).value }, 
      employeeDependents: [
        {  FirstName: (document.getElementById("fname1")).value, 
           LastName: (document.getElementById("lname1")).value },
        {  FirstName: (document.getElementById("fname2")).value, 
           LastName: (document.getElementById("lname2")).value },
        {  FirstName: (document.getElementById("fname3")).value, 
            LastName: (document.getElementById("lname3")).value }
       ] 
    }

    axios
    .post("http://localhost:52688/Payroll/CalculateBenefitCost", model, config)
    .then(data => 
      { 
        document.getElementById("TotalBenfitsCost").innerHTML = "$" + data.data;
      })
    .catch(error => console.log(error));
  }

  Cancel = () =>  {
    this.props.parentCallback(true, 0);
  }
  
  render () {
    return (
      <div id="test" onChange={this.LoadData(this.props.getParentState())}>
          <h2>Employee</h2>
          <br></br>
          <label className="generalelements"> First name: </label>
          <input type="text" data-id="" id="fname" name="fname" autocomplete="off"/>
          <label className="generalelements"> Last name: </label>
          <input type="text" id="lname" name="lname" autocomplete="off"/>
          <br></br><br></br>

          <h2>Employees Dependants</h2>
          <br></br>
          <label className="generalelements"> First name: </label>
          <input type="text" data-id="" id="fname1" name="fname1" autocomplete="off" />
          <label className="generalelements"> Last name: </label>
          <input type="text" id="lname1" name="lname1" autocomplete="off"/>
          <br></br>
          <label className="generalelements"> First name: </label>
          <input type="text" data-id="" id="fname2" name="fname2" autocomplete="off"/>
          <label className="generalelements"> Last name: </label>
          <input type="text" id="lname2" name="lname2"autocomplete="off" />
          <br></br>
          <label className="generalelements"> First name: </label>
          <input type="text" data-id="" id="fname3" name="fname3" autocomplete="off"/>
          <label className="generalelements"> Last name: </label>
          <input type="text" id="lname3" name="lname3" autocomplete="off"/>
          <br></br>
          <br></br><br></br>
         
          <input type="button" value="Calculate" title="Calculate benifits" className="btn-primary" onClick={this.CalculateBenfitsCost}></input>

          <input type="button" value="Save" title="Save data" className="btn-primary" onClick={this.Save}></input>

          <input type="button" value="Cancel" title="Cancel" className="btn-primary" onClick={this.Cancel}></input>
          <br></br>

          <br></br>
          <label className="generalelements"> Total Benfits Cost Per Pay Period: </label>
          <label id="TotalBenfitsCost" className="generalelements">$0</label>
          <br></br><br></br>
      </div>
    );
  }
}
