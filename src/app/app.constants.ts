import { Injectable } from "@angular/core";

@Injectable()
export class AppConstants {

    statColumns = ["name","date","nominal","numeric","regular","averagable","dateFormat","count","max","min","stdDev","mean","sum","distinct","unique","missing","nominalCount"];
    statColumnTitles = ["Name","isDate","isNominal","isNumeric","isRegular","isAveragable","DateFormat","count","max","min","stdDev","mean","sum","distinct","unique","missing","nominalCount"];
    associationList = [{label: "Apriori", value: "Apriori"}, {label: "Eclat", value: "Eclat"}, {label: "F-P Growth", value: "FPGrowth"}];
    clusteringList = [{label: "K-means", value: "Kmeans"}, {label: "DBSCAN", value: "DBSCAN"}
    , {label: "F-P Growth", value: "FPGrowth"}
    , {label: "Gaussian Mixture", value: "GaussianMixture"}
    , {label: "BIRCH", value: "BIRCH"}
    , {label: "Affinity Propagation", value: "AffinityPropagation"}
    , {label: "Mean-Shift", value: "MeanShift"}
    , {label: "OPTICS", value: "OPTICS"}
    , {label: "Agglomerative", value: "Agglomerative"}
  ];
  
    
    
    regressionList = [{label: "Linear Regression", value: "LinearRegression"}, {label: "Random Forest", value: "RandomForest"}];
    classificationList = [{label: "Naive Byes", value: "NaiveByes"}, {label: "Tree", value: "Tree"}, {label: "Random Forest", value: "Random Forest"}, {label: "Logistic", value: "Logistic regression"}];
}