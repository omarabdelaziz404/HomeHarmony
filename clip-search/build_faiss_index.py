import os
import torch
import clip
from PIL import Image
import faiss
import numpy as np

# Load the CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

# Folder with images
image_folder = "images"  # Set this to the path of your image directory
image_files = [f for f in os.listdir(image_folder) if f.endswith(('.png', '.jpg', '.jpeg'))]

embeddings = []

# Process and embed each image
for filename in image_files:
    image_path = os.path.join(image_folder, filename)
    image = preprocess(Image.open(image_path)).unsqueeze(0).to(device)  # Shape: [1, 3, 224, 224]

    with torch.no_grad():
        embedding = model.encode_image(image)
        embedding /= embedding.norm(dim=-1, keepdim=True)  # Normalize to unit vector
        embeddings.append(embedding.cpu().numpy())

# Stack into a single numpy array
embedding_array = np.vstack(embeddings).astype("float32")  # shape: [N, 512]

# Build and save FAISS index
dimension = embedding_array.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embedding_array)
faiss.write_index(index, "image_index.faiss")

print(f"Indexed {len(embedding_array)} images.")
