# 100-Day Microfinance Loan Application Plan

Based on domain research and the provided backend API, this document outlines the frontend implementation plan for building a robust **100-Day Daily Collection Loan System**.

## 1. Domain Overview: The 100-Day Scheme
A typical 100-day microfinance loan operates on the following mechanics:
* **Target Audience**: Small vendors, daily wage earners, and micro-businesses that have steady daily cash flow.
* **The Math**: A borrower takes a principal amount (e.g., $10,000). A flat interest rate is applied (e.g., 20%). The total repayment ($12,000) is strictly divided into 100 equal daily installments ($120/day).
* **Upfront Deductions**: Processing fees or insurance are often deducted before disbursement.
* **The Operation**: "Collectors" (field agents) visit clients daily to collect the cash, and these collections must be accurately entered, verified, and reconciled by the branch every evening.

## 2. Proposed UI Architecture
Since we are using **Angular 19** and **Angular Material** with a clean White/Black theme, the application will feature:
* **Responsive Layout**: A collapsible Material Sidenav for navigation and a top toolbar for user profile/logout.
* **Mobile-First Data Entry**: The daily collection screens must be optimized for mobile devices so field agents can input data on the go.
* **Data Tables**: Extensive use of Angular Material Data Tables with pagination, filtering, and sorting for ledgers and reports.

## 3. Core Modules to Implement

### A. Authentication & Authorization (`/api/auth/*`)
* **Login Screen**: Simple, secure login.
* **Role-Based Access Control (RBAC)**: Differentiating between Branch Managers, Admins, and Field Collectors to restrict views (e.g., Collectors only see their assigned daily route).

### B. Customer Management (`/api/customers/*`)
* **Customer List & Search**: Search functionality by name, ID, or phone number.
* **Customer Profile**: A unified view showing a customer's personal details, active loans, and historical ledger.

### C. Loan Origination & Management (`/api/loans/*`)
* **Loan Creation Wizard**: 
  * Select Customer & Branch.
  * Input Principal Amount and flat Interest Rate.
  * **Auto-Calculate**: Instantly calculate the daily collection amount and the exact maturity date (100 days from start).
* **Loan Status Tracking**: Active, Closed, Defaulted.

### D. Daily Collection Module (`/api/collections/*`)
* **Collector's Route (Daily Sheet)**: A rapid data-entry interface listing all expected collections for the day.
* **Payment Entry**: Inputting actual cash received vs expected. 
* **Verification Pipeline**: A workflow where field agents submit collections, and a manager uses the `/verify`, `/approve`, or `/reject` endpoints to finalize the daily ledger.

### E. Analytics & Reports (`/api/reports/*`)
* **Dashboard**: KPIs such as "Today's Target", "Collected Amount", and "Shortfall".
* **High-Risk/Defaulters List**: Highlighting loans that have missed 3+ consecutive days.
* **Customer Ledger**: Detailed, printable day-by-day statement of a specific loan.

---

## 4. Open Questions / Design Decisions to Resolve

1. **Working Days**: Does the 100-day schedule include weekends and public holidays, or is it exactly 100 consecutive calendar days?
2. **Target Platform**: Are we prioritizing this strictly as a Desktop Web App for the back-office staff, or does it need to be highly responsive for Field Collectors using mobile phones?
3. **Upfront Fees**: Do you want the Loan Creation screen to handle upfront deduction calculations (e.g., Document/Processing fees)?
4. **Starting Point**: Which module would you like to build first? I recommend starting with the **Main Navigation Layout** and **Authentication/Login** to set a solid foundation.
