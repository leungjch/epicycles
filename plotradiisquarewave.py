import matplotlib.pyplot as plt


x = [200,66.66666666666667,40,28.571428571428573,22.22222222222222,18.181818181818183,15.384615384615385,13.333333333333334,11.764705882352942,10.526315789473685,9.523809523809524,8.695652173913043,8,7.407407407407407,6.896551724137931,6.451612903225806,6.0606060606060606,5.714285714285714,5.405405405405405,5.128205128205129,4.878048780487805,4.651162790697675,4.444444444444445,4.25531914893617,4.081632653061225,3.9215686274509802,3.7735849056603774,3.6363636363636362,3.508771929824561,3.389830508474576,3.278688524590164,3.1746031746031744,3.076923076923077,2.985074626865672,2.898550724637681,2.816901408450704,2.73972602739726,2.6666666666666665,2.5974025974025974,2.5316455696202533,2.4691358024691357,2.4096385542168677,2.3529411764705883,2.2988505747126435,2.247191011235955,2.197802197802198,2.150537634408602,2.1052631578947367,2.0618556701030926,2.0202020202020203,1.9801980198019802,1.941747572815534,1.9047619047619047,1.8691588785046729,1.834862385321101,1.8018018018018018,1.7699115044247788,1.7391304347826086,1.7094017094017093,1.680672268907563,1.6528925619834711,1.6260162601626016,1.6,1.5748031496062993,1.550387596899225,1.5267175572519085,1.5037593984962405,1.4814814814814814,1.4598540145985401,1.4388489208633093,1.4184397163120568,1.3986013986013985,1.3793103448275863,1.3605442176870748,1.342281879194631,1.3245033112582782,1.3071895424836601,1.2903225806451613,1.2738853503184713,1.2578616352201257,1.2422360248447204,1.2269938650306749,1.2121212121212122,1.1976047904191616,1.183431952662722,1.1695906432748537,1.1560693641618498,1.1428571428571428,1.1299435028248588,1.1173184357541899,1.1049723756906078,1.092896174863388,1.0810810810810811,1.0695187165775402,1.0582010582010581,1.0471204188481675,1.0362694300518134,1.0256410256410255,1.015228426395939,1.0050251256281406,0.9950248756218906]
print(len(x))
x = x[0:15]

fig = plt.figure(figsize = (8,5), dpi=200)
plt.stem(range(len(x)), x)
plt.xlabel("Order of epicycle")
plt.ylabel("Epicycle radius")
fig.savefig("radiisquarewave.png")

plt.show()
