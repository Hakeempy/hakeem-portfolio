export type Course = {
  key: string;
  /** Short name for the course switcher. */
  tab: string;
  title: string;
  /** One line on where the course starts and where it ends. */
  promise: string;
  /** Keys into src/components/toolkit/logos.ts */
  logos: string[];
  modules: { title: string; topics: string[] }[];
};

// The outlines of the four courses I teach, module by module (from the course outlines).
export const courses: Course[] = [
  {
    key: "sql",
    tab: "SQL",
    title: "SQL for Data Analysis",
    promise: "From your first SELECT to window functions, CTEs and stored procedures.",
    logos: ["sql"],
    modules: [
      {
        title: "Databases and SQL",
        topics: ["Relational and non-relational databases", "SELECT, FROM and WHERE", "Database design"],
      },
      {
        title: "Querying",
        topics: ["Filtering, sorting and limiting results", "INNER, LEFT, RIGHT and FULL joins", "Subqueries"],
      },
      {
        title: "Aggregation",
        topics: ["GROUP BY and HAVING", "SUM, COUNT and AVG", "Window functions"],
      },
      {
        title: "Changing data",
        topics: ["INSERT, UPDATE and DELETE", "Transactions and data integrity", "Common table expressions"],
      },
      {
        title: "Advanced SQL",
        topics: ["Indexing and query optimisation", "Views and stored procedures", "Security and user roles"],
      },
    ],
  },
  {
    key: "python",
    tab: "Python",
    title: "Python for Data Analysis and Machine Learning",
    promise: "From Python basics to cleaning data with pandas, training models and sharing them as an app.",
    logos: ["python"],
    modules: [
      {
        title: "Python for data",
        topics: ["Setting up Jupyter and VS Code", "Data types, loops and conditionals", "NumPy, pandas and Matplotlib"],
      },
      {
        title: "Data wrangling with pandas",
        topics: ["Reading and writing many sources", "Cleaning, transforming and aggregating", "Missing values and duplicates"],
      },
      {
        title: "Visualisation",
        topics: ["Plots with Matplotlib and Seaborn", "Heatmaps, pair plots and time series", "Charts ready to publish"],
      },
      {
        title: "Machine learning with scikit-learn",
        topics: [
          "Supervised and unsupervised learning",
          "Logistic regression and decision trees",
          "K-means clustering and PCA",
        ],
      },
      {
        title: "Evaluation and deployment",
        topics: ["Accuracy and the confusion matrix", "Cross-validation and tuning", "Deploying a model with Streamlit"],
      },
    ],
  },
  {
    key: "excel",
    tab: "Excel",
    title: "Excel for Data Analysis",
    promise: "From formulas and lookups to pivot tables, Power Query and macros.",
    logos: ["excel"],
    modules: [
      {
        title: "Excel for analysis",
        topics: ["The interface", "Workbooks and worksheets", "Cells and ranges"],
      },
      {
        title: "Cleaning and formatting",
        topics: ["Sorting and filtering", "Duplicates and missing values", "Formatting text and numbers"],
      },
      {
        title: "Formulas and functions",
        topics: ["SUM, AVERAGE and COUNT", "IF, AND and OR", "VLOOKUP, HLOOKUP, INDEX and MATCH"],
      },
      {
        title: "Charts and pivots",
        topics: ["Bar, line and pie charts", "Conditional formatting and sparklines", "Pivot tables and pivot charts"],
      },
      {
        title: "Advanced Excel",
        topics: ["Power Query", "Macros and automation", "Data validation"],
      },
    ],
  },
  {
    key: "bi",
    tab: "Power BI / Tableau",
    title: "Power BI / Tableau for Data Visualisation",
    promise: "From connecting a data source to publishing interactive dashboards, in either tool.",
    logos: ["powerbi", "tableau"],
    modules: [
      {
        title: "Why visualise",
        topics: ["Why visualisation matters", "The Power BI and Tableau workspaces", "Connecting data sources"],
      },
      {
        title: "Preparing data",
        topics: ["Cleaning and transforming", "Relationships between tables", "DAX and calculated fields"],
      },
      {
        title: "Building visuals",
        topics: ["Bars, lines, maps and heatmaps", "Filters, slicers and drill-through", "Hierarchies and groups"],
      },
      {
        title: "Interactive dashboards",
        topics: ["Building the dashboard", "Parameters and calculated measures", "Publishing and sharing reports"],
      },
      {
        title: "Good practice",
        topics: ["Designing dashboards that read well", "Performance on large datasets", "Collaboration and version control"],
      },
    ],
  },
];
