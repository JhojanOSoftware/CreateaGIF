import imageio.v3 as iio
from PIL import Image
import numpy as np  



class GIFcreator: 
    def createvidgif(self):#Where we have the video  
        video_path = 'sources/example.mp4'
        #extract frames from the video
        frames =[]
        for i , frame in enumerate(iio.imiter(video_path)):
            if i >= 40:  # Limit to the first 120 frames
                break
            frames.append(frame)

        iio.imwrite('results/outvideo.gif',frames, duration=100, loop = 0 ) 
    
    def createimgdif(self):

            imgs = [Image.open('sources/imt1.jpeg'), Image.open('sources/imt2.jpeg'), Image.open('sources/imt3.jpeg'), Image.open('sources/imt4.jpeg')]
            size = imgs[0].size
            imgs = [img.resize(size) for img in imgs]
            imgs = [np.array(img) for img in imgs]
            iio.imwrite('results/gifoutputimg.gif', imgs, duration=500, loop=0)#loop equal 0 means infinite loop
if __name__ == "__main__":
    creator = GIFcreator()
    creator.createvidgif()
    creator.createimgdif()