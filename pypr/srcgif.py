import sys
import os
import imageio.v3 as iio
from PIL import Image
import numpy as np



def is_image(filename):
    ext = os.path.splitext(filename)[1].lower()
    return ext in ['.png', '.jpg', '.jpeg']

def is_video(filename):
    ext = os.path.splitext(filename)[1].lower()
    return ext in ['.mp4']

def images_to_gif(image_files, output_gif):
    imgs = [Image.open(f) for f in image_files]
    size = imgs[0].size
    imgs = [img.resize(size) for img in imgs]
    imgs = [np.array(img) for img in imgs]
    iio.imwrite(output_gif, imgs, duration=500, loop=0)

def video_to_gif(video_file, output_gif, max_frames=40):
    frames = []
    for i, frame in enumerate(iio.imiter(video_file)):
        if i >= max_frames:
            break
        frames.append(frame)
    iio.imwrite(output_gif, frames, duration=100, loop=0)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python srcgif.py <input_file(s)> <output_gif>")
        sys.exit(1)

    input_arg = sys.argv[1]
    output_gif = sys.argv[2]

    # Si es un solo archivo de imagen o video
    if is_image(input_arg):
        images_to_gif([input_arg], output_gif)
        print("GIF creado a partir de imagen.")
    elif is_video(input_arg):
        video_to_gif(input_arg, output_gif)
        print("GIF creado a partir de video.")
    # Si es una lista de imágenes separadas por coma
    elif ',' in input_arg:
        files = [f.strip() for f in input_arg.split(',') if is_image(f.strip())]
        if files:
            images_to_gif(files, output_gif)
            print("GIF creado a partir de varias imágenes.")
        else:
            print("No se encontraron imágenes válidas.")
    else:
        print("Formato de archivo no soportado. Usa mp4 para video o png/jpg/jpeg para imágenes.")