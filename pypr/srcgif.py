import sys
import os
import imageio.v3 as iio
from PIL import Image
import numpy as np

def main():
    flatinpt = []  # Almacena input fils
    inputfls = sys.argv[1:-1]  # Todos los argumentos excepto el último
    outputfls = sys.argv[-1]  # El último argumento es el archivo de salida
    for arg in inputfls:
        flatinpt.extend(arg.split(','))  # Dividir por comas si hay varias entradas
        flatinpt = [f.strip() for f in flatinpt if f.strip()]  # Eliminar espacios en blanco y entradas vacía   s
    if len(sys.argv) < 3:
        print("Uso: python srcgif.py <input_file(s)> <output_gif>")
        sys.exit(1)


    PassInPt(flatinpt)

def FlEx (files): #funcion para verificar si exixte el archivo 
    for f in files:
        try:
            if not os.path.exists(f):
                print(f"Archivo no encontrado: {f}")
                sys.exit(1)
        except Exception as e:
              print(f"Error al verificar el archivo {f}: {e}")
              sys.exit(1)
              return True



def Imgs(filename): #Verifica si el archivo es una imagen
    ext = os.path.splitext(filename)[1].lower()
    return ext in ['.png', '.jpg', '.jpeg']

def Vds(filename): #Verifica si el archivo es un video
    ext = os.path.splitext(filename)[1].lower()
    return ext in ['.mp4']
    
def PassInPt(input_arg):
    try:            
        if ',' in input_arg:
            files = [f.strip() for f in input_arg.split(',') if Imgs(f.strip())]
            return 'images', files
        elif Imgs (input_arg):
            return "images", [input_arg]
        elif Vds(input_arg):
            return "video", [input_arg]
    except Exception as e:
        print(f"Error al procesar el argumento: {e}")
        sys.exit(1)
        return "unsupported"

def Ld_Re(image_files,output_gif):   
    try: 
        imgs = [Image.open(f) for f in image_files]
        size = imgs[0].size
        return [np.array(img.resize(size)) for img in imgs]  # Redimensionar imágenes al tamaño de la primera
    except  Exception as e : 
        print(f"Error al cargar archivos: {e}")
        sys.exit(1)

def ImgsGif(image_files, output_gif):
    try: 
        FlEx(image_files)  # Verificar si los archivos existen
        imgs = Ld_Re(image_files, output_gif)
        iio.imwrite(output_gif, imgs, duration=500, loop=0)
    except Exception as e: 
        print(f"Error al crear el GIF de imagenes: {e}")
        sys.exit(1)
def VdsGif(video_file, output_gif, max_frames=40):
    try: 
        frames = []
        for i, frame in enumerate(iio.imiter(video_file)):
            if i >= max_frames:
                break
            frames.append(frame)
        iio.imwrite(output_gif, frames, duration=100, loop=0)
    except Exception as e:
        print(f"Error al crear el GIF del video: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()        