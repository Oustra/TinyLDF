# TinyLDF: A Lightweight Linked Data Platform

TinyLDF is a lightweight Linked Data Fragments platform that allows users to perform SPARQL-like quad searches and add new quads, provided they are authenticated. The platform supports Google Authentication and features a responsive web app built with Mithril.js, CSS, Java (REST API), and Google Cloud Datastore.

---

# Group Members
   - FENNASSI Oussama
   - MOTTET Valentin
   - OULBOUB Safaa
   - EL HMIDI Yasmina

---

## Features

### Core Functionalities
1. **Quad Search**
   - Search using `subject`, `predicate`, `object`, and `graph`.
   - Results are displayed in a structured table where:
     - Columns represent `subject`, `object`, `predicate`, and `graph`.
     - Clicking on any table cell filters results based on the clicked value.

2. **Add New Quads**
   - Authenticated users can add new quads (`subject`, `predicate`, `object`, `graph`) to the datastore.

3. **Performance Insights**
   - Each API call displays the query execution time for improved user transparency.

---

## Technologies Used

- **Frontend**: 
  - [Mithril.js](https://mithril.js.org/) for a lightweight and fast UI framework.
  - CSS for styling.

- **Backend**: 
  - Java-based REST API for processing quad searches and additions.
  - Google Cloud Datastore for data storage.

- **Authentication**:
  - Google Authentication for secure access to quad creation features.
