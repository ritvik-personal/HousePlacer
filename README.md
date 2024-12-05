# HousePlacer
Our names are Ritvik Sajja, Sanchit Gupta, Aneesh Gadgil.
This is our Housing Web Application to help connect Students and Real Estate Managers to help the student find the perfect home near campus.

Start Page: 
Upon running the application, the user should be able to see our home page - a registration page. 
Depending on your history with our application, you may take any of the following steps:

Case 1: If you are a new user, regardless of whether you are a manager or student, you should fill out your email, 
username (at least 5 characters), and password(at least 8 characters) to register for a new account. 
To submit this information, make sure to click on the button titled ''. 
Make sure to record your username and password somewhere, as you will need this to login in the future. 
As this is your first time sign-in, upon login, you will be directed to your dashboard.

Case 2: If you are an existing student/manager, you should classify yourself by clicking on either of the relevant buttons: 
"Already a student" or "Already a manager". By selecting the relevant one, you should be able to access your sign-in portal, 
where you can enter your username/password and select "Sign in" to access your dashboard.

Student Dashboard:

When a new user accesses the student dashboard for the first time, they will not be able to view/launch the 
marketplace until they fill out the preference form. The preference form can be accessed by clicking on the 'Tasks' 
button located on the task bar. Upon access of the empty preference form, the user should see fields for a variety of 
relevant housing attributes for them to express their ideal accommodation. These attributes include, 
but are not limited to: desired number of bedrooms, desired number of bathrooms, desired distance to campus, etc. 
For each of these attributes, users should express a weight (from 1 to 5) that represents the priority of each of the preferences. 
This is a measure of how important one feels that a specific housing attribute is relative to the others.
For example, if you feel that being close to the campus and rent are the most important attributes, and you are indifferent to the other
attributes, you may give those two attributes a priority value equal to 5, and the rest a priority of 1. Upon completion of the form, 
the user should click "Submit Preferences". To confirm the successful submission, the user should see a success toaster upon click. 

Now that the student user has entered their preferences, they may access the marketplace for the first time. The marketplace view contains
the properties within the application's database that would be the most suitable based on their preference form entries/submissions.

If the student would like to explore more details regarding the accommodation, they may click on the "View Details" button. This will show
a dialog containing the relevant features of the property along with its reviews entered by other students. 

If the student would like to write a review on a given property themselves, they may click on "Write a Review", and enter a rating from 1-5, 
and a review description. As soon as this review is submitted, it will be recorded under the "Reviews" section of the property's details.

If a student would like to see more specific information about the property (e.g. more pictures/property manager contact information), 
they may click on the "Visit Website" button, which should re-direct them to the relevant page. Note that the current properties in the 
database are not real, so the links do not work.

If a student does have a specific property in mind, and they don't feel like looking through the list, they can also search it by name.
The search properties tab at the top allows users to enter the property name as the keyword, and then returns properties from the database
containing that given keyword.

Lastly, if a student would like to save a given property, so they can view it on their "Saved Properties" page, they may select the 
"Save button". Upon click of the "Saved Properties" button on the taskbar, the student should be able to see all properties they have 
saved (if any). If at any point a student feels that they no longer want to consider a given property, they can click the "Remove" button, 
to ensure that it is removed from their "Saved Properties" database.

Note: If a student at any point feels that they made a mistake in their preference form or have had a change of heart, they may click
on the "Tasks" button on the taskbar. They can then access their preference form with the saved entries. Over here, they can edit any 
of their submitted values, and then click "Save Preferences" to update them in the database. There should be a success toaster that 
indicates that this data was accurately updated within the database. As soon as the student sees the toaster, they may click on the 
"Marketplace" button on the taskbar to access the updated, ranked list of their property recommendations.

To exit the student dashboard/account at any point, the user can select the "Logout" button on their taskbar, which would return them
to our start/registration page.


Manager Dashboard:

Upon entry to the dashboard, the property manager can view the "My Properties" page, containing all of the properties they 
ever entered into the database. It is expected that upon first time entry to the manager dashboard, this page should be empty, 
given that the manager has never added any of their properties to the app. 

To actually add a property, the manager may click on the "Tasks" button on their taskbar. Upon click, they should see a "Add a Property"
Form containing fields for them to describe the property in great detail. This may include aspects of the property such as the name, 
rent, square footage, etc. After the manager is done filling in each field, they may scroll to the bottom of the form and click the 
"Submit" button. Upon click of the "Submit" button, the property information should be sent to our application database, with a success
toaster in the top right corner confirming this. To verify this, when the manager clicks on the "My Properties" button along the taskbar, 
they should now be able to see a card representing the property they just entered into the database.

To edit/delete any of the properties within the database, the manager may click on the "My Properties" button on the taskbar. To delete any 
of them, they can simply click the "Delete" button located at the bottom of the card. That should remove them from the view immediately. 
To edit any of the properties, the manager can select the "View Details" button located at the bottom of the card, next to the "Delete" button.
This should open up a dialog view, with fields containing the existing values for some of the property aspects. The manager can go into 
any of these fields, edit the values, and save their edits by clicking the "Save" button. Upon saving their edits, the dialog view will 
be exited, and the manager should immediately be able to see the changes they have applied.

Lastly, the manager can view the Marketplace too, by clicking on the "Marketplace" button located on the taskbar. There, they can see 
what their property looks like in the perspective of the students.

To exit the manager dashboard/account at any point, the user can select the "Logout" button on their taskbar, which would return them
to our start/registration page.