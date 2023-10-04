NAMESPACE=rainbow
IMAGE=harbor.liebi.com/rainbow/subql:6


build:
	docker build -f Dockerfile -t ${IMAGE} .

push:build
	docker push ${IMAGE}

deploy:
	kubectl apply -f k8s/deploy.yaml

update:push
	kubectl rollout restart deploy  -n rainbow  rainbow6-subql