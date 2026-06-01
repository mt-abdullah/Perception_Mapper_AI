# Technical Documentation: Leave Management System

## 1. System Architecture
The **Leave Management System** is built using a **Three-Tier Architecture** pattern. This structure separates concerns into three distinct layers, promoting high maintainability, reusability, and secure boundaries.

```
                  ┌────────────────────────────────────────┐
                  │          Presentation Layer            │
                  │   - LoginForm.cs                       │
                  │   - AdminDashboard.cs                  │
                  │   - EmployeeDashboard.cs               │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │         Business Logic Layer           │
                  │   - Models (User, LeaveType, Request)  │
                  │   - AuthService.cs, LeaveService.cs    │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │          Data Access Layer             │
                  │   - DatabaseHelper.cs                  │
                  │   - UserDAL.cs, LeaveRequestDAL.cs     │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │            Database Engine             │
                  │   - Microsoft SQL Server               │
                  └────────────────────────────────────────┘
```

### 1.1 Presentation Layer (UI)
*   **Role**: Handles the user interface, renders screens, collects input, and displays messages to the user.
*   **Key Components**:
    *   `LoginForm.cs`: Collects credentials and checks access.
    *   `AdminDashboard.cs`: Main interface for administrators to review leaves, manage employees, and update system configurations.
    *   `EmployeeDashboard.cs`: Portal for employees to apply for leave, monitor applications, and check remaining leave balances.
    *   `ApplyLeaveForm.cs`: Interface for employees to choose leave dates and input reasons.

### 1.2 Business Logic Layer (BLL)
*   **Role**: Coordinates logical tasks, validates input ranges, runs rules, and handles cryptographic helpers.
*   **Key Components**:
    *   `AuthService.cs`: Coordinates authentication logic and maintains active sessions.
    *   `LeaveService.cs`: Evaluates business logic, checks balance availability, and processes balance modifications upon approval.
    *   `HashHelper.cs`: Utilizes SHA-256 to hash passwords safely before database storage.
    *   `Models/`: Direct entity blueprints mapping database rows to C# objects (e.g., `User.cs`, `LeaveType.cs`, `LeaveRequest.cs`).

### 1.3 Data Access Layer (DAL)
*   **Role**: Operates directly with the SQL Server database. Contains SQL statements and stores queries. It handles query executions and maps database rows to datasets.
*   **Key Components**:
    *   `DatabaseHelper.cs`: Opens and closes connections; exposes wrapper routines to execute parameters.
    *   `UserDAL.cs`: Performs CRUD operations against the `Employees` table.
    *   `LeaveTypeDAL.cs`: Controls configurations and queries against the `LeaveTypes` table.
    *   `LeaveRequestDAL.cs`: Manages CRUD and status operations for `LeaveRequests` and updates `LeaveBalances`.

---

## 2. Database Schema Design
The backend relies on **Microsoft SQL Server**. It consists of four primary tables, related via foreign key constraints.

### 2.1 Table Definitions

#### 1. Employees Table
Stores administrative and employee profile records.
*   `ID` (INT, Primary Key, Identity): Unique identity.
*   `EmployeeCode` (VARCHAR, Unique): Automatically generated system code (e.g., `Emp1`).
*   `Name` (NVARCHAR(100)): Full name of the user.
*   `Department` (NVARCHAR(100)): Allocated department.
*   `Role` (NVARCHAR(50)): Privileges, restricted to either `'Admin'` or `'Employee'`.
*   `Username` (NVARCHAR(50), Unique): Access login name.
*   `PasswordHash` (NVARCHAR(256)): SHA-256 hashed password.
*   `CreatedAt` (DATETIME): Timestamp of registration.

#### 2. LeaveTypes Table
Stores leaf types defined by administrators.
*   `ID` (INT, Primary Key, Identity): Unique identity.
*   `LeaveTypeCode` (VARCHAR, Unique): Generated code (e.g., `LT1`).
*   `Name` (NVARCHAR(50), Unique): Name of the leave category (e.g., `Casual Leave`).
*   `MaxDays` (INT): Total days allowed per year.
*   `Description` (NVARCHAR(255)): Optional details about the type.

#### 3. LeaveBalances Table
Maintains real-time status of each employee's annual leave limit, usage, and remaining days.
*   `ID` (INT, Primary Key, Identity): Unique identity.
*   `BalanceCode` (VARCHAR, Unique): Generated balance code (e.g., `Bal1`).
*   `EmployeeID` (INT, Foreign Key): References `Employees(ID)`.
*   `LeaveTypeID` (INT, Foreign Key): References `LeaveTypes(ID)`.
*   `AllocatedDays` (INT): Maximum allowed days.
*   `UsedDays` (INT): Accumulated days approved so far.
*   `RemainingDays` (INT): Calculated days left (`AllocatedDays` - `UsedDays`).

#### 4. LeaveRequests Table
Maintains transactions of individual leave requests.
*   `ID` (INT, Primary Key, Identity): Unique request identity.
*   `RequestCode` (VARCHAR, Unique): Generated request code (e.g., `Req1`).
*   `EmployeeID` (INT, Foreign Key): References the requesting `Employees(ID)`.
*   `LeaveTypeID` (INT, Foreign Key): References `LeaveTypes(ID)`.
*   `FromDate` (DATE): Start of leave.
*   `ToDate` (DATE): End of leave.
*   `Duration` (INT): Total number of business days.
*   `Reason` (NVARCHAR(500)): Explanatory remark.
*   `Status` (NVARCHAR(50)): Review status, restricted to `'Pending'`, `'Approved'`, or `'Rejected'`.
*   `ProcessedBy` (INT, Foreign Key): References the `Employees(ID)` who processed the request.
*   `CreatedAt` (DATETIME): Submission timestamp.

---

## 3. Core Technical Processes & Flows

### 3.1 Secure Authentication Flow
1. The user logs in via `LoginForm.cs`.
2. The UI calls `AuthService.ValidateLogin(username, password)`.
3. The password is encrypted in the business layer using `HashHelper.ComputeSha256(password)`.
4. The system queries the `Employees` table via `UserDAL` to check if `Username` and `PasswordHash` match.
5. If verified, the system initializes the session using the corresponding `User` model containing their ID, Name, Department, and Role.

### 3.2 Leave Application Flow
1. An employee chooses a date range and leave type inside `ApplyLeaveForm.cs`.
2. The system checks basic parameters (`ToDate >= FromDate`) and calculates the `Duration` in days.
3. The business layer (`LeaveService.cs`) queries `LeaveBalances` to check if `Duration <= RemainingDays`.
4. If valid, the record is inserted into the `LeaveRequests` table with a `'Pending'` status.

### 3.3 Leave Approval & Balance Update Flow
1. An admin clicks **Approve** on a pending leave in the `AdminDashboard`.
2. The request is processed inside `LeaveService.cs`:
   * The status in `LeaveRequests` changes to `'Approved'`.
   * The corresponding record in `LeaveBalances` is updated:
     * `UsedDays` is increased by the request's `Duration`.
     * `RemainingDays` is decreased by the request's `Duration`.
3. Changes are committed to the SQL database using database parameters.
