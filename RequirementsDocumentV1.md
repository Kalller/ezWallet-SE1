# Requirements Document - current EZWallet

Date: 11/04

Version: V1 - description of EZWallet in CURRENT form (as received by teachers)

 
| Version number | Change |
| ----------------- |:-----------|
| 1.1 | Context diagram, interfaces, FR, NFR, Deployment Diagram | 
| 1.1.2 | add images |
| 1.1.3 | redesign diagrams with PlantUML |
| 1.2 | add personas |
| 1.3 | add use cases and scenarios |
| 1.4 | add defects table |
| 1.5 | add business model |
| 1.6 | fix NFRs |
| 1.6.1 | fix rendering errors in PlantUML |
| 1.7 | fix Use Cases |
| 1.7.1 | fix typos |

# Contents

- [Requirements Document - current EZWallet](#requirements-document---current-ezwallet)
- [Contents](#contents)
- [Informal description](#informal-description)
	- [Business Model](#business-model)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	- [Context Diagram](#context-diagram)
	- [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	- [Functional Requirements](#functional-requirements)
	- [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	- [Use case diagram](#use-case-diagram)
		- [Use case 1: Manage accounts (UC1)](#use-case-1-manage-accounts-uc1)
				- [Scenario 1.1: Register Account](#scenario-11-register-account)
				- [Scenario 1.2: Login](#scenario-12-login)
		- [Use case 2: Manage transactions (UC2)](#use-case-2-manage-transactions-uc2)
				- [Scenario 2.1: Create Transactions](#scenario-21-create-transactions)
		- [Use case 3: Manage Categories (UC3)](#use-case-3-manage-categories-uc3)
			- [Scenario 3.1: Create a category](#scenario-31-create-a-category)
			- [Scenario 3.2: View categories](#scenario-32-view-categories)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)
- [Defects Table](#defects-table)

# Informal description
EZWallet (read EaSy Wallet) is a software application designed to help individuals and families keep track of their expenses. Users can enter and categorize their expenses, allowing them to quickly see where their money is going. EZWallet is a powerful tool for those looking to take control of their finances and make informed decisions about their spending.

## Business Model
The business model is based on voluntary donations from users who appreciate our open-source app. The application does not offer any premium services or features that require payment. 

# Stakeholders

| Stakeholder name  | Description | 
| ----------------- |:-----------:|
| **User** | Uses the system. There are different user profiles (see later). In our case is formed by all the users of the application that are logged in the system and have access to the app.|
| **Software Developer** | The developer writes the code.|
| **Administrator** | Has more functions available than normal users (e.g. `getUsers()`). |

# Context Diagram and interfaces

## Context Diagram
<!-- \<Define here Context diagram using UML use case diagram> -->
```plantuml
left to right direction

actor User as a

rectangle System #Yellow {
  (EzWallet) #LightBlue
  a -- (EzWallet) 
}
```
<!-- \<actors are a subset of stakeholders> -->

## Interfaces
<!-- \<describe here each interface in the context diagram> -->

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
| User | GUI (register, logIn/logOut, create categories, check expenses, add/remove transactions)  |  PC (Screen and Keyboards) |

<!-- \<GUIs will be described graphically in a separate document> -->


# Stories and personas
<!-- \<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system> -->

**Persona 1: Budget-Conscious Shopper**  
Sarah, a full-time university student who is also a part-time retail worker. As a busy student, Sarah needs to keep track of her expenses to stay within budget. She uses EZWallet to categorize her expenses, such as groceries, textbooks, and bills.

Sarah can use EZWallet to set limits in each category to ensure she stays within her budget. EZWallet also provides personalized notifications if she exceeds her spending limits in a particular category, allowing her to adjust her spending appropriately.


**Persona 2:  Vacation Planner**  
Tom and Emily are a married couple who enjoy travelling with their three children. As a family vacation planner, Emily is responsible for planning and budgeting their vacations. She needs to keep track of their vacation expenses, including transportation, accommodation, food, and activities.

EZWallet can help Emily categorize the family's vacation expenses providing her more control over the vacation budget. Emily uses the software to analyze her family's vacation spending patterns and make informed decisions to plan her trip efficiently.


**Persona 3: Business Owner**  
Charles, who owns a café in the downtown area. He uses EZWallet to track his business expenses related to supplies, travel, marketing, and payroll. Categorizing these expenses helps him to analyze his business spending and identify any areas where he could reduce costs.

**Persona 4: Recent College Graduate**  
Lauren is a recent college graduate trying to establish healthy financial habits. She found the transition to adulting to be challenging, but EZWallet has made it easier. She uses the application to track her expenses, such as rent, utilities, shopping, and entertainment.

Using EZWallet has enabled Lauren to gain financial knowledge by providing her with statistical data on her spending behaviour. She can now make well-informed decisions to develop healthy financial habits to achieve her financial goals.


<!-- \<stories will be formalized later as scenarios in use cases> -->


# Functional and non functional requirements

## Functional Requirements

<!-- \<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system> -->

<!-- \<they match to high level use cases> -->

| ID    	| Description  |
| ------------- |:-------------:|
|  FR1 	| Manage accounts |
|  FR1.1 	|  Register account |
|  FR1.2 	|  Login |
|  FR1.3 	|  Logout |
|  FR1.4 	|  Get Users |
|  FR1.5 	|  Authorize |
| FR2  | Manage transactions |
| FR2.1  | Create transactions |
| FR2.2  | Get transactions |
| FR2.3  | Delete transactions |
| FR3  | Manage categories |
| FR3.1  | Create categories |
| FR3.2  | Get categories |
| FR4  | Get labels |


## Non Functional Requirements

<!-- \<Describe constraints on functional requirements> -->

| ID    	| Type (efficiency, reliability, ..)       	| Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
| NFR1 	| Usability  | Core functions for users (read transactions), should be used with no training by all users with at least 1yr experience with browsers | All FR|
| NFR2 	| Availability |  99.9% uptime | - |
| NFR3 	| Efficiency| All functions should be completed in 0.5s | All FR|
| NFR4 	| Security|  Access only to authorized users |FR 1.5 |
| NFR5 	| Maintainability |The facility to  modify software components,  to correct faults, improve performance  or to adapt to a changed environment. For measures, refer to `EstimationV1.md` | - |
| NFR6 	| Portability | Effort to redeploy application on other platform, browser compatibility: javascript support| - |
| NFR7		| Correctness | Capability to provide intended functionality in all cases (no error while querying the database, show only data required). | All FR |

# Use case diagram and use cases
## Use case diagram
<!-- \<define here UML Use case diagram UCD summarizing all use cases, and their relationships> -->

```plantuml
actor User
User -- (FR1: Manage Accounts)
User -- (FR2: Manage Transactions)
User -- (FR3: Manage Categories)
```

<!-- \<next describe here each use case in the UCD> -->
### Use case 1: Manage accounts (UC1)
| Actors Involved        | User |
| ------------- |:-------------:|
|  Precondition     | User has installed the EZWallet application |
|  Post condition     | User's account is managed |
|  Nominal Scenario     | User registers, logs in, logs out, authorizes, edits, deletes, and adds a profile picture |
|  Variants     | N/A |
|  Exceptions     | Invalid account credentials, network errors|

##### Scenario 1.1: Register Account
| **Scenario 1.1** | |
| ------------- |:-------------:|
|  Precondition     | User has not registered an account |
|  Post condition     | User's account is registered and it is logged in |
| Step#        | Description  |
|  1     | User launches the EZWallet application |
|  2     | User selects "Register" from the Login page of the GUI |
|  3     | User fills in the required information (username, email and password) |
|  4     | User submits the registration form |
|  5     | System creates the new account and stores it in the database |
|  6     | User receives a confirmation message |

##### Scenario 1.2: Login
| **Scenario 1.2** | |
| ------------- |:-------------:|
|  Precondition     | User has a registered account |
|  Post condition     | User is logged in |
| Step#        | Description  |
|  1     | User launches the EZWallet application |
|  2     | User enters their email and password |
|  3     | User selects "Login" |
|  4     | System validates the user's credentials |
|  5     | System logs the user in and displays the home page of EZWallet |

### Use case 2: Manage transactions (UC2)
| Actors Involved        | User |
| ------------- |:-------------:|
|  Precondition     | User is logged in |
|  Post condition     | User's transactions are managed |
|  Nominal Scenario     | User creates, gets, deletes, and filters transactions |
|  Variants     | N/A |
|  Exceptions     | Invalid transaction data, network errors |

##### Scenario 2.1: Create Transactions
| **Scenario 2.1** | |
| ------------- |:-------------:|
|  Precondition     | User is logged in and wants to create a new transaction |
|  Post condition     | New transaction is created and added to the user's transaction list |
| Step#        | Description  |
|  1     | User navigates to the "Transactions" section (home page) |
|  2     | User fills the requested data for the new transaction (name, amount, date, type) or leaves them to default values |
|  3     | User submits the transaction form |
|  4     | System creates the new transaction and stores it in the database |

### Use case 3: Manage Categories (UC3)
| Actors Involved        | User |
| ------------- |:-------------:|
|  Precondition     | User is logged in and has access to the categories section |
|  Post condition     | Category is created or retrieved based on user action |
|  Nominal Scenario     | 1. User selects to create or retrieve a category. 2. User provides necessary input for the chosen action. 3. System processes the request and updates the category list accordingly. 4. User receives a confirmation message regarding the success of the operation (only in case of a new category). |
|  Variants     | None |
|  Exceptions     | 1. User provides invalid input for the chosen action.  2. System fails to process the request. |

#### Scenario 3.1: Create a category
| **Scenario 3.1** | |
| ------------- |:-------------:|
|  Precondition     | User is logged in and has access to the categories section |
|  Post condition     | A new category is created and added to the user's category list |
| Step#        | Description  |
|  1     | User clicks on the "new Category" text field |  
|  2     | The user provides the category name |
|  3     | System popups a confirmation message asking for a color |
|  4     | The user selects a color or leaves the default one |
|  5     | The system creates the new category according to user choices |
|  6     | System displays a confirmation message and adds the new category to the user's category list |

#### Scenario 3.2: View categories
| **Scenario 3.2** | |
| ------------- |:-------------:|
|  Precondition     | User is logged in and has access to the categories section |
|  Post condition     | User views their existing categories |
| Step#        | Description  |
|  1     | User navigates to the categories section |
|  2     | System retrieves and displays the list of user's categories |


# Glossary

<!-- \<use UML class diagram to define important terms, or concepts in the domain of the application, and their relationships>  -->

```plantuml
left to right direction
class Category {
+ Type
+ Colour
}

class Transactions {
+ Name
+ Type
+ Amount
+ Date
}

class User {
+ Username
+ Password
+ Email
}


Transactions "1..*" -- Category
User -- " " Transactions
note top of User #LightGray: Descriptor of Users
note top of Transactions #LightGray: List of all of the transactions made by users
note top of Category #LightGray: Descriptor of Categories
```

<!-- \<concepts must be used consistently all over the document, ex in use cases, requirements etc> -->

# System Design
<!-- \<describe here system design> -->

```plantuml
class EzWallet #Yellow 
class "EzWallet Client / Server" #Red 
class "Browser" #LightBlue
class "Web server" #LightBlue
class "DBServer" #LightBlue

EzWallet o-- "EzWallet Client / Server"
  "EzWallet Client / Server" <|-- "Browser"

  "EzWallet Client / Server" <|-- "Web server"
  "EzWallet Client / Server" <|-- "DBServer"
note bottom of DBServer: "MongoDB"
note bottom of "Web server" 
  Node.js
  React
end note
```

<!-- \<must be consistent with Context diagram> -->

# Deployment Diagram 

<!-- \<describe here deployment diagram > -->

```plantuml
node "PC client / Server" #LightYellow

artifact "Browser" #LightBlue
artifact "Web server" #LightBlue
artifact "DBServer" #LightBlue

"PC client / Server" <.. "Browser"
"PC client / Server" <.up. "Web server"
"PC client / Server" <.up. "DBServer"

note bottom of "Browser" #LightGray: Compatible Browser
note top of "Web server" #LightGray: Node.js must be installed on the machine
note top of "DBServer" #LightGray: MongoDB (for users and transactions)
```

# Defects Table
|Name|Description|
|---|:---:|
| `getUsers` |Should be used by an user with admin privileges, but this check is not done|
| `get_labels` |Doesn’t work, should be fixed|
| `getUserByUsername` |Doesn’t work properly|
| `get_transactions` | All transactions are shown indipendently of the user logged in. This is a security issue that must be fixed as soon as possible. |
