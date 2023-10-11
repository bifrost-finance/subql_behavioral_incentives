NAMESPACE=rainbow
IMAGE=harbor.liebi.com/rainbow/subql-polkadot:6
IMAGE-TEST=harbor.liebi.com/rainbow/subql:6


build:
	sed -i 's/endpoint: \([^,]*\)/endpoint: ws:\/\/172.19.64.39:29944/' project.yaml
	docker build -f Dockerfile -t ${IMAGE} .

push:build
	docker push ${IMAGE}

build-test:
	sed -i 's/endpoint: \([^,]*\)/endpoint: ws:\/\/172.19.0.14:8040/' project.yaml
	docker build -f Dockerfile -t ${IMAGE-TEST} .

push-test:build-test
	docker push ${IMAGE-TEST}

deploy-test:
	kubectl apply -f k8s/deploy.yaml

update-test:push-test
	kubectl rollout restart deploy  -n rainbow  rainbow6-subql

deploy:
	kubectl apply -f k8s/polkadot.yaml

update:push
	kubectl rollout restart deploy  -n rainbow  polkadot-subql