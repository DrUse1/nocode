name = 'test-lambda-with_file-dl'
container_name = 'test-file-dl'
region = 'eu-west-3'
account_id = '339712719329'

one = f"aws ecr create-repository --repository-name {name}"

two = f"docker build -t {container_name} ."

three = f"aws ecr get-login-password --region {region} | docker login --username AWS --password-stdin {account_id}.dkr.ecr.{region}.amazonaws.com"

four = f"docker tag {container_name}:latest {account_id}.dkr.ecr.{region}.amazonaws.com/{name}:latest"

five = f"docker push {account_id}.dkr.ecr.{region}.amazonaws.com/{name}:latest"

x = [one] + [two] + [three] + [four] + [five]


for i in x:
    print()
    print()
    print(i)