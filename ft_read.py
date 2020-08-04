import pandas as pd
import json
import numpy as np
import matplotlib.pyplot as plt
import itertools

x = pd.read_json("fet.json")
print(x)

freqs = x.freq

res = x.re
ims = x.im

mag = (res**2 + ims**2)**0.5
print(mag)
print(len(mag))
print(len(freqs))


list=zip(*sorted(zip(*(freqs,mag))))
plt.xlabel("Frequency")
plt.ylabel("Magnitude")
plt.plot(*list)

plt.show()
