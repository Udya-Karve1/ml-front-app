import { Injectable } from "@angular/core";

@Injectable()
export class AppConstants {

    statColumns = ["name","date","nominal","numeric","regular","averagable","dateFormat","count","max","min","stdDev","mean","sum","distinct","unique","missing","nominalCount"];
    statColumnTitles = ["Name","isDate","isNominal","isNumeric","isRegular","isAveragable","DateFormat","count","max","min","stdDev","mean","sum","distinct","unique","missing","nominalCount"];
    
    associationList = [
      { label: "Apriori", value: "Apriori"}
      , {label: "FastICA", value: "FastICA"}
      , {label: "F-P Growth", value: "FPGrowth"}
    ];
    clusteringList = [{label: "K-means", value: "Kmeans"}, {label: "DBSCAN", value: "DBSCAN"}
    , {label: "F-P Growth", value: "FPGrowth"}
    , {label: "Hierarchical clustering", value: "Hierarchical clustering"}
    , {label: "DBSCAN", value: "DBSCAN"}
    , {label: "Expectation-Maximization", value: "Expectation-Maximization"}
    , {label: "OPTICS", value: "OPTICS"}
  ];
  
    regressionList = [{label: "Linear Regression", value: "LinearRegression"}
    , {label: "Random Forest", value: "RandomForest"}
    , {label: "Multilayer Perceptron", value: "MultilayerPerceptron"}
    , {label: "Support Vector Regression", value: "SupportVectorRegression"}
    , {label: "Decision Trees", value: "DecisionTrees"}
    , {label: "M5P", value: "M5P"}
    ];
    classificationList = [
      {label: "Naive Byes", value: "NaiveByes"}
      , {label: "Decision Trees", value: "DecisionTrees"}
      , {label: "k-Nearest Neighbors", value: "kNearestNeighbors"}
      , {label: "Support Vector Machines", value: "SupportVectorMachines"}
      , {label: "Random Forest", value: "RandomForest"}
      , {label: "Logistic", value: "Logistic"}
    
    ];
}
