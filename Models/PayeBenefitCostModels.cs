using System.Collections.Generic;
using PayrollApp.BusinessLogic;

namespace PayrollApp.WebApplication.Models
{
    public class PayeBenefitCostModels
    {
        public class PayeBenefitCostVM
        {
            public Employee employee { get; set; }
            public List<EmployeeDependent> employeeDependents { get; set; }
        }
    }
}
