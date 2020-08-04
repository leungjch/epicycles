import pandas as pd
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
import numpy as np
import csv
from matplotlib import style


plt.style.use('ggplot')

# Order (important for arrays): Yellow, blue, green, orange, red
yellowMarker = "P"
blueMarker = "v"
greenMarker = "o"
orangeMarker = "^"
redMarker = "s"
uvMarker = "x"
chartreuseMarker = "s"
nameList = ["UV", "Blue", "Green", "Yellow", "Orange", "Red"]
markerList = [uvMarker, blueMarker, greenMarker, yellowMarker, orangeMarker, redMarker]
colourList = ["#20165b", "#6fa1d2", "#6ebe6e", "#ffeb7a", "#ffaa00", "#e71837"]

filesets = [["1_U.csv", "1_B.csv", "1_G.csv", "1_C.csv", "1_Y.csv", "1_O.csv", "1_R.csv"],
            ["2_U.csv", "2_B.csv", "2_G.csv", "2_C.csv", "2_Y.csv", "2_O.csv", "2_R.csv"],
            ["3_U.csv", "3_B.csv", "3_G.csv", "3_C.csv", "3_Y.csv", "3_O.csv", "3_R.csv"],
            ["4_U.csv", "4_B.csv", "4_G.csv", "4_C.csv", "4_Y.csv", "4_O.csv", "4_R.csv"]]

filesets = [["1_U.csv", "1_B.csv", "1_G.csv", "1_Y.csv", "1_O.csv", "1_R.csv"],
            ["2_U.csv", "2_B.csv", "2_G.csv", "2_Y.csv", "2_O.csv", "2_R.csv"],
            ["3_U.csv", "3_B.csv", "3_G.csv", "3_Y.csv", "3_O.csv", "3_R.csv"],
            ["4_U.csv", "4_B.csv", "4_G.csv", "4_Y.csv", "4_O.csv", "4_R.csv"]]

# exponential function
def func(x, a, b, c):
    return a * np.exp(-b * x) + c

def funcl(x, m, c):
    return m*x+c


col_names =  ["name", 'm', 'c', 'xInt', "r2"]
coeffs  = pd.DataFrame(columns = col_names)

col_names1 = ["name", "xMax", "xMin", "yMax", "yMin", "xMinUncert",  "xMaxUncert", "yMaxUncert", "yMinUncert", "maxSlope" , "minSlope" , "avgDiff_slope", "maxXInt", "minXInt", "avgDiff_xInt"]
maxMins  = pd.DataFrame(columns = col_names1)

col_names =  nameList
avgs  = pd.DataFrame(columns = col_names)
avgs.loc[len(avgs)] = [0,0,0,0,0,0]


plt.figure(num=None, figsize=(6.5, 4), dpi=800, facecolor='w', edgecolor='k')

for fileset in filesets:
    filesetnum = 0
     
    #fig, axs = plt.subplots(len(fileset))
    n = 0 # for filename positions 
    for filename in fileset:
        # Get marker and colour
        myMarker = markerList[n]
        myColour = colourList[n]
        myName = nameList[n]
        print(filename)
        #fig.suptitle(filename)

        my_csv = pd.read_csv(filename)

        # Assign uncertainties
        #Voltage
        my_csv["uncertainty_V"] = my_csv["V"]*(0.01/my_csv["V"] + 0.02)
        # Current
        my_csv["uncertainty_I"] =  (0.02 / (my_csv["V0"] - my_csv["V1"]) + 0.02)*my_csv["I"]
    
        # Store unfiltered points for plotting all data points
        allpoints = my_csv          

        # Filter points above 0.5 milliamps
        my_csv = my_csv[my_csv.I > 0.5] 

        # Generate linear regression coefficients
        popt, pcov = curve_fit(funcl, my_csv.V, my_csv.I)
        
        # Calculate x intercept (forward voltage)
        xInt = -popt[1]/popt[0]
        print(xInt)

        
        # Creating points for max-min
        maxX_all = my_csv.iloc[-1]
        minX_all = my_csv.iloc[0]
        maxY_all = my_csv.loc[my_csv.I.idxmax()]
        minY_all = my_csv.loc[my_csv.I.idxmin()]

        # Creating points for plotting fit
        xFit = np.linspace(xInt, maxX_all.V, num=200)
        yFit = funcl(xFit, *popt)
        yFit_small = funcl(my_csv["V"], *popt)

        distanceFilter = my_csv
        distanceFilter["distance"] = yFit_small - my_csv["I"]
        distanceFilter["distance"] = distanceFilter["distance"].abs()
        distanceFilter = distanceFilter[distanceFilter.distance <0.6]
        
        # Creating points for max-min
        maxX_distanceFilter = distanceFilter.iloc[-1]
        minX_distanceFilter = distanceFilter.iloc[0]
        maxY_distanceFilter = distanceFilter.loc[distanceFilter.I.idxmax()]
        minY_distanceFilter = distanceFilter.loc[distanceFilter.I.idxmin()]

        # Calculate R^2
        ss_res = np.sum((my_csv.I - yFit_small) ** 2)
        ss_tot = np.sum((my_csv.I - np.mean(my_csv.I)) ** 2)
        r2 = 1 - (ss_res / ss_tot)


 
        # Get max min lines
        maxSlope= ((maxY_distanceFilter.I+maxY_distanceFilter.uncertainty_I)-(minY_distanceFilter.I-minY_distanceFilter.uncertainty_I))/((maxX_distanceFilter.V-maxX_distanceFilter.uncertainty_V)-(minX_distanceFilter.V+minX_distanceFilter.uncertainty_V))
        minSlope= ((maxY_distanceFilter.I-maxY_distanceFilter.uncertainty_I)-(minY_distanceFilter.I+minY_distanceFilter.uncertainty_I))/((maxX_distanceFilter.V+maxX_distanceFilter.uncertainty_V)-(minX_distanceFilter.V-minX_distanceFilter.uncertainty_V))
        avgDiff_slope = (maxSlope-minSlope)/2

        bMax = (maxY_distanceFilter.I+maxY_distanceFilter.uncertainty_I) - maxSlope * (maxX_distanceFilter.V-maxX_distanceFilter.uncertainty_V)
        bMin = (minY_distanceFilter.I+minY_distanceFilter.uncertainty_I) - minSlope * (minX_distanceFilter.V-minX_distanceFilter.uncertainty_V)

        xIntMax = -bMax/maxSlope
        xIntMin = -bMin/minSlope
        avgDiff_xInt = (xIntMax-xIntMin)/2
        
        # Creating points for plotting fit
        xMinFit = np.linspace(xIntMin, maxX_all.V, num=200)
        yMinFit = minSlope * xMinFit + bMin
        plt.plot(xMinFit, yMinFit, c=myColour, linestyle=":", marker = '', label = '_nolegend_')

        xMaxFit = np.linspace(xIntMax, maxX_all.V, num=200)
        yMaxFit = maxSlope * xMaxFit + bMax
        plt.plot(xMaxFit, yMaxFit, c=myColour, linestyle=":", marker = '', label = '_nolegend_')

       # Plot DATA
        #plt.scatter(allpoints.V, allpoints.I, marker=myMarker, color=myColour)
        plt.errorbar(allpoints.V, allpoints.I, yerr = allpoints.uncertainty_I, xerr=0.01, marker=myMarker, linestyle='None', c=myColour, markersize=1.5, label= '_nolegend_')
        #plt.errorbar(my_csv.V, my_csv.I, yerr = my_csv.uncertainty_I, xerr=0.01, marker=myMarker, linestyle='None', c=myColour)

        # Plot FIT
        plt.plot(xFit, yFit, color=myColour, label = myName + " ($y = " + str(format(popt[0], ".3f")) + "x" + str(format(popt[1], ".3f")) + ")$\n($R^2 = " + str(format(r2, '.3f')) +"$)")
        plt.legend(loc=2, prop={'size': 8})
       

        # Name axes
        plt.xlabel("Voltage (V)")
        plt.ylabel("Current (mA)")

        # show points beyond 1.4V
        plt.xlim(0.5,3.5)
        plt.ylim(-0.5,10)
        # Save figure
    
        coeffs.loc[len(coeffs)] = [filename, popt[0], popt[1], xInt, r2]

        maxMins.loc[len(maxMins)] = [filename,maxX_distanceFilter.V,minX_distanceFilter.V,maxY_distanceFilter.I, minY_distanceFilter.I, maxX_distanceFilter.uncertainty_V,
                                      minX_distanceFilter.uncertainty_V, maxY_distanceFilter.uncertainty_I, minY_distanceFilter.uncertainty_I,
                                      maxSlope, minSlope, avgDiff_slope,
                                     xIntMax, xIntMin, avgDiff_xInt]
        print(avgs)
        old = avgs.iloc[0][myName]
        print(old)
        avgs.set_value(0, myName, old+xInt)
        n+=1
        

    
    plt.show(block=False)
    filesetnum += 1
    coeffs.to_csv("linreg_coeffs.csv")
    maxMins.to_csv("maxMins.csv")
    plt.savefig("fitplots/"+filename+".png", )

    plt.clf()
avgs = avgs / 4
avgs.to_csv("avg.csv")