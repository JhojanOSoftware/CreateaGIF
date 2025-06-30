import imageio.v3 as iio
from PIL import Image
import numpy as np  
 
imgs = [Image.open('sources/imt1.jpeg'), Image.open('sources/imt2.jpeg'), Image.open('sources/imt3.jpeg'), Image.open('sources/imt4.jpeg')]
size = imgs[0].size
imgs = [img.resize(size) for img in imgs]
imgs = [np.array(img) for img in imgs]
iio.imwrite('results/outimages.gif', imgs, duration=500, loop=0)#loop equal 0 means infinite loop