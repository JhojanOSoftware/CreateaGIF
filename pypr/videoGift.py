import imageio.v3 as iio
from PIL import Image
import numpy as np
 
#Where we have the video  
video_path = 'sources/example.mp4'

#extract frames from the video
frames =[]
for i , frame in enumerate(iio.imiter(video_path)):
    if i >= 40:  # Limit to the first 5 frames
        break
    frames.append(frame)

iio.imwrite('results/outvideo.gif',frames, duration=100, loop = 0 ) 