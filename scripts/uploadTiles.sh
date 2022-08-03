gsutil -o GSUtil:parallel_process_count=1 -m  cp -r ./out/pbf gs://eu-trees4f-tiles
gsutil cors set ./scripts/CORS.json gs://eu-trees4f-tiles
gsutil -o GSUtil:parallel_process_count=1 -m setmeta -r -h "Content-Encoding:gzip" gs://eu-trees4f-tiles/pbf