# Student performance Dashboard

This dashboard want to emulate a Ministry report focused to show how the academic performance of the students are influenced from external factors. In this case I tried 
to seek a correlation between alcohol consumption and parental education level, showing how they can determine the final
scholastic result of the students.

# User experience (UX) design

This dashboard is for schools administrators, students and families. It's main purpose is to help the students to achieve their best result in a
healthy and safe way. The analysis is focus on harmful behaviour, such drinking large amount of alcohol during a classic workday or the support that the
students can receive from their families in terms of their level of instruction.
The dashboard does not want to say that there are families better that others but instead want to try to analyze the reason behind a scholastic result, 
providing information and then the means to to put in place a plan to support the people who might need it.
It's possible for example to increase the informations provide to the students regardings the serious problem that an huge consume of alcohol can conduct or create special
extra-scholastic lessons.

As any one of the users, he/she would be interested in finding information about the following:
 - Schools gender composition
 - Schools age composition
 - Level of education of the mothers
 - Level of education of the fathers
 - Units of alcohol consumed per gender
 - Final result in the math test per gender
 - The graphs can portray different pieces of information to users when different options are selected or when filters are applied.

# Features

Following features have been implemented for ease of use

   - **Schools selector** drop down with the two schools taken in consideration for the dashboard
   - **Bar chart** displays the gender compostion of the schools
   - **Bar chart** displays the age composition of the schools
   - **Number Display** displays the percenatage of mothers and father with an university education
   - **Scatter Plot** displays the consumption of alchool per gender related with the math result test
   - **Bar chart** displays the math result test related per gende

The dashboard is not complete and is reductive to identify the result of the test with only the two cases taken in consideration in this project. The report should taken
in consideration many other factors such consumption of drugs, distance between school and  home of the students, their health and the natural 
predisposition of the students with the matter taken in consideration(math in this case) considering that the students can excel in other discipline.
More data need to be collected to let the project be more truthful and to create more accurate  support plans.


# Technologies used includes:

   [**HTML5**](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5) to create the structure of the page.  
   [**CSS3**](https://developer.mozilla.org/en-US/docs/Web/CSS) to style the web page.  
   [**Bootstrap 4.3.1**](https://getbootstrap.com/) to make the page responsive.  
   [**Font Awesome**](https://fontawesome.com/) for the github icon and for the icon used to show the univerity level of education.  
   [**Markdown**](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to write this README file.  
   
   **JS Libraries** to visualise, explore and filter datasets:  
     
- **d3.js**  used to build charts      
- **crossfilter.js** to filters data in csv file    
- **dc.js** : makes d3 and crossfilter work swimmingly  
- **queue.js**: Used to load the data  
  

# Testing

The webpage is tested across the following browsers,

  - Google Chrome 
  - Firefox 
  

##### Testing Tools Used:

- [**W3C CSS Validation Service**](https://jigsaw.w3.org/css-validator/).(no error found)  
- [**W3C Markup Validation Service**](https://validator.w3.org/).(no error found)    
- [**JavaScript** (code passes through a linter)](https://jshint.com/)(no error found)   
- My Samsung Galaxy S7(the site display correctly)   
- Chrome Dev tools for inspect elements for styling purpose and media queries  

The page is fully responsive and change dynamically if the screen is resize. Above 768px there are no problem for the correct visualization 
of the charts. Below 768px I had to create an x-scroll for each chart to let them show correctly and I had to place each chart in one row due 
to the not responsiveness of **d3**.
All the chart are working and the results they show match the data in the CSV file.

# Deployment

Project is built and developed on AWS Cloud9 workspace.

The following steps are followed to deploy the pages:

- Initialised the local directory in my project as a git repository used the cloud9 terminal to perform this step $git init
- Added the files in the local repository created. And staged them for commit $git add .
- Commited the files that I have staged in the local repository. $git commit –m ”description of the change made” Every time a new piece of functionality is add to the project.
- Created a new repository in Github and in the terminal, added the URL for the remote repository where your local repository will be pushed. $git push origin master.
- On major changes I have pushed the changes in the local repository to GitHub. $git push.
- On Github Click Settings of the repository hosting the project and generated the external link.


[Link to Github repository](https://github.com/Baal89/second-milestone-project)  
[Link to Final Project](https://baal89.github.io/second-milestone-project/)

# Credits

### Content
I took inspiration for this project from a CSV file found on Kaggle(https://www.kaggle.com/uciml/student-alcohol-consumption).  
This project is been developed from the codes learnt throughout the course of Introduction to Data Visualiization design  of CodeInsitute. 

### Acknowledgements
I would like to thanks my mentor for his support and his precious feedback 