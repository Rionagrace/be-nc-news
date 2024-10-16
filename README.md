# Northcoders News API

https://nc-news-2e8v.onrender.com/api

Backend API from which you can view topics, articles, users and comments, including posting/deleting comments and voting on articles. 

Dependencies: 

       "dotenv": "^16.0.0",
        "express": "^4.21.1",
        "pg": "^8.7.3",
        "supertest": "^7.0.0",
        "pg-format": "^1.0.4"
      
      "devDependencies": 
        "husky": "^8.0.2",
        "jest": "^27.5.1",
        "jest-extended": "^2.0.0",
        "jest-sorted": "^1.0.15"
      

To create the correct environment variables create the following files:

.env.test

containing

PGDATABASE=nc_news_test

.env.development

containing

PGDATABASE=nc_news_development


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
