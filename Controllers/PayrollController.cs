using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PayrollApp.BusinessLogic;
using static PayrollApp.WebApplication.Models.PayeBenefitCostModels;
using PayrollApp.Data;
using PayrollApp.Domain;
using System.Collections.Generic;
using System.Linq;
using System;

namespace PayrollApp.WebApplication.Controllers
{
    [ApiController]
    public class PayrollController : ControllerBase
    {
        private readonly ILogger<PayrollController> _logger;
        private readonly IPayrollBenefitCost _payrollBenefitCost;
        private readonly PayrollContext dbContext = new PayrollContext();

        public PayrollController(ILogger<PayrollController> logger, IPayrollBenefitCost payrollBenefitCost)
        {
            try
            {
                dbContext.Database.EnsureCreated();
                _logger = logger;
                _payrollBenefitCost = payrollBenefitCost;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
            }
        }

        [HttpPost]
        [Route("Payroll/CalculateBenefitCost")]
        public double CalculateBenefitCost([FromBody] PayeBenefitCostVM payeBenefitCostVM)
        {
            try
            {
                return _payrollBenefitCost.CalculateBenefitCost(payeBenefitCostVM.employee, payeBenefitCostVM.employeeDependents);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
            }
            return 0;
        }

        [HttpGet]
        [Route("Payroll/Employee/Get/{id}")]
        public PayrollApp.Domain.Employee Get(int id)
        {
            try
            {
                var employees = dbContext.Employee.Where(w => w.Id == id).SingleOrDefault();
 
                employees.Dependants = dbContext.Dependants.Where(w => w.EmployeeId == employees.Id).ToList();

                return employees;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
            }
            return null;
        }

        [HttpGet]
        [Route("Payroll/Employee/Get")]
        public List<PayrollApp.Domain.Employee> Get()
        {
            try
            {
                var employees = dbContext.Employee
                          .ToList();

                return employees;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
            }
            return null;
        }

        [HttpPost]
        [Route("Payroll/Employee/Add")]
        public void Add([FromBody] PayeBenefitCostVM payeBenefitCostVM)
        {
            try
            {
                PayrollApp.Domain.Employee employee = new PayrollApp.Domain.Employee()
                {
                    FirstName = payeBenefitCostVM.employee.FirstName,
                    LastName = payeBenefitCostVM.employee.LastName
                };

                if (payeBenefitCostVM.employeeDependents != null && payeBenefitCostVM.employeeDependents.Count > 0)
                {
                    foreach (EmployeeDependent empdep in payeBenefitCostVM.employeeDependents)
                    {
                        if (!(string.IsNullOrWhiteSpace(empdep.FirstName) && string.IsNullOrWhiteSpace(empdep.LastName)))
                        {
                            employee.Dependants.Add(new Dependants()
                            {
                                FirstName = empdep.FirstName,
                                LastName = empdep.LastName
                            });
                        }
                    };
                }
                dbContext.Employee.Add(employee);
                dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
            }
        }

        [HttpPost]
        [Route("Payroll/Employee/Update")]
        public void Update([FromBody] PayeBenefitCostVM payeBenefitCostVM)
        {
            try
            {
                var employee = dbContext.Employee
                          .Where(w => w.Id == (int)payeBenefitCostVM.employee.Id)
                          .FirstOrDefault<Domain.Employee>();

                employee.Dependants = dbContext.Dependants
                    .Where(x => employee.Id == x.EmployeeId)
                    .ToList<Domain.Dependants>();

                List<int> empdepint = payeBenefitCostVM.employeeDependents
                    .Where(x => !string.IsNullOrWhiteSpace(x.FirstName) && !string.IsNullOrWhiteSpace(x.LastName))
                    .Select(x => (int)x.Id)
                    .ToList();

                employee.Dependants
                    .RemoveAll(x => x.EmployeeId == employee.Id && !empdepint.Contains(x.Id));

                employee.FirstName = payeBenefitCostVM.employee.FirstName;
                employee.LastName = payeBenefitCostVM.employee.LastName;

                if (payeBenefitCostVM.employeeDependents != null && payeBenefitCostVM.employeeDependents.Count > 0)
                {
                    foreach (EmployeeDependent empdep in payeBenefitCostVM.employeeDependents)
                    {
                        var dpen = employee.Dependants.Where(x => x.Id == empdep.Id).FirstOrDefault();
                        if (dpen != null && dpen.Id > 0)
                        {
                            dpen.FirstName = empdep.FirstName;
                            dpen.LastName = empdep.LastName;
                        }
                        else if (!(string.IsNullOrWhiteSpace(empdep.FirstName) && string.IsNullOrWhiteSpace(empdep.LastName)))
                        {
                            employee.Dependants.Add(new Dependants()
                            {
                                FirstName = empdep.FirstName,
                                LastName = empdep.LastName
                            });
                        }
                    };
                }

                dbContext.Employee.Update(employee);
                dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
            }
        }

        [HttpGet]
        [Route("Payroll/Employee/Delete/{employeeId}")]
        public void Delete(int employeeId)
        {
            try
            {
                var employee = dbContext.Employee
                          .Where(w => w.Id == employeeId)
                          .FirstOrDefault<PayrollApp.Domain.Employee>();

                if (employee != null)
                {
                    dbContext.Employee.Remove(employee);
                    dbContext.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
            }
        }
    }
}
