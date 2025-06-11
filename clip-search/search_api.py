import faiss
import numpy as np
import os
from PIL import Image
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import io


# Enable CORS for all origins (for development)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/search")
async def search(file: UploadFile = File(...)):
    # Read uploaded image
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")

    # Preprocess and embed the uploaded image
    query_embedding = model.encode([img], convert_to_tensor=True).cpu().numpy().astype("float32")

    # Load FAISS index and image paths
    index = faiss.read_index("image_index.faiss")
    image_paths = np.load("image_paths.npy")

    # Search for the most similar images
    D, I = index.search(query_embedding, k=5)  # k = number of results
    results = []
    for i in I[0]:
        rel_path = os.path.relpath(image_paths[i], start=".")
        if rel_path not in results:
            results.append(rel_path)
    return {"results": results}

# Load the CLIP model
model = SentenceTransformer("clip-ViT-B-32")

# Directory with images
image_dir = "images"
image_paths = []
image_embeddings = []
app.mount("/images", StaticFiles(directory="images"), name="images")

for filename in os.listdir(image_dir):
    if filename.lower().endswith((".jpg", ".jpeg", ".png")):
        path = os.path.join(image_dir, filename)
        try:
            image = Image.open(path).convert("RGB")
            image_tensor = model.encode([image], convert_to_tensor=True)
            image_embeddings.append(image_tensor.cpu().numpy()[0])
            image_paths.append(path)
        except Exception as e:
            print(f"Failed to process {filename}: {e}")

# Create FAISS index
if image_embeddings:
    image_embeddings_np = np.vstack(image_embeddings).astype("float32")
    index = faiss.IndexFlatL2(image_embeddings_np.shape[1])
    index.add(image_embeddings_np)
    faiss.write_index(index, "image_index.faiss")

    # Save image paths to match search results
    np.save("image_paths.npy", np.array(image_paths))
    print(f"Indexed {len(image_paths)} images.")
else:
    print("No embeddings to index.")

import numpy as np
paths = np.load("image_paths.npy")
print(paths)
print(set(paths))
print(len(paths), len(set(paths)))
