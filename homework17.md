1. pr-checks.yml  
Does linter and unit tests check on every raised PR. Also builds the docker image but does not push it anywhere.
![img.png](img/img.png)
![img_1.png](img/img_1.png)
2. build-and-stage.yml  
Runs on merge in main branch. Builds and pushes to AWS ECR image with "stage" tag. Creates a release manifest. Does a force deploy of ECS service. 
![img_2.png](img/img_2.png)
3. deploy-prod.yml  
Takes an image with stage tag and adds prod tag. After that force deploys a prod service in ECS. Workflow runs only manually and requires an approval.
![img_5.png](img/img_5.png)
![img_3.png](img/img_3.png)
![img_4.png](img/img_4.png)


AWS services:
ECS:
![img_6.png](img/img_6.png)
prod logs:
![img_8.png](img/img_8.png)
ECR:
![img_7.png](img/img_7.png)