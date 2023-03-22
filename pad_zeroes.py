#!/usr/bin/env python
import sys,os,re

for file in sys.argv[1:]:
    if __file__ in file: continue
    # replace "CardTemplateDouble-1-"" with empty string in the file name
    

    words = re.split('-|\.',file)
    words[-2] = words[-2].zfill(3)
    if words[0] and words[-1] == 'webp':
        new_name = "_".join(words[-2:-1]) + "." + words[-1]
        os.rename(file,new_name)

