# Code - Keeper

## Credits

Anton, Karlutska

## Prerequisites 

1. Amazon account
2. Terraform
3. AWS CLI (connected to your account)
4. kubectl (see https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html to set up your kubectl to work with your cloud)
5. Ansible
6. (Credit card and a lot of patience)

## Project Structure 

The project consists of 3 micro services we made ourselves, API gateway (which routes the traffic to each app), billing-app (which handles everything billing related), movies-app (which handles everything movies related). Our project also has RabbitMQ and 2 postgres instances. All of the services run in Docker containers which only have the bare minimum software to run all the apps inorder to provide easier scalability and lower costs.

Our project leverages EKS (AWS Elastic Kubernetes service) for microservice deployment and scaling across multiple AZs (Availability Zones) for high availability. The use of API Gateway, Route 53, and ALB allows efficient handling of both internal and external traffic. Terraform and Helm simplify infrastructure management, while CloudWatch ensures comprehensive monitoring. Each component, including databases and messaging via RabbitMQ, is optimized for redundancy and fault tolerance.

We make use of Gitlab to store code and automate the development cycle of our services. Gitlab offers us powerful tools that we make use of to build, test, scan and containerize our projects and the ease of putting updates live with a single "& git push" command.

## Running the project

### Step 1. Setting up Gitlab

- There are multiple approaches to take here, 1st and easiest would be to use [gitlab's website](http://gitlab.com) which would require nothing more than registering an account.

- Other two approaches are a bit more difficult but not to worry, we got you covered with an ansible playbook that will take care of which ever way you choose

    1. Self hosting gitlab on your own Virtual machine, which will require you to set up the neccessary networking and ensuring it has connection to internet. Next, it is recommended to setup a SSH key.

    2. Cloud hosting gitlab, this step will be a little bit more expencive but in the end it will be easier because AWS conveniently has a lot of the features that we need in a relatively simple to understand web UI. This will require you to make a VPC(Virtual Private Cloud) and launching an EC2 instance on it(check the [gitlab documentation](https://docs.gitlab.com/ee/install/requirements.html) to make sure your instance has the requirements to run it according to your needs). Keep your SSH key with you, this will be required in the next step.

- After that you will need to set up the ansible Vault(for different environment variables) which can be done after editing the example_vars.yml file. Use ```ansible-vault encrypt gitlab-setup/vars.yml``` commnand to encrypt your desired variables(don't forget to rename it to vars.yml). Now you will need to edit your inventory.ini file and change the gitlab host, the server user which ansible will use for it's actions, last but not least, add the path to your SSH key.

- Next step is as easy as deploying your ansible playbook by running the command ```ansible-playbook -i inventory.ini install-gitlab.yml --ask-pass --ask-vault-pass --ask-become-pass```

![gitlab install](https://imgur.com/a/X5e20cz)

- Now you have successfully installed gitlab! You can now go to the machines public address and try logging in with the "root" account and your personal password that you set. After you have successfully logged in, navigate to your profile settings and generate an access key.

- Decrypt your vars.yml file by running ```ansible-vault decrypt vars.yml``` and add the token there, after that it's time to make life easier and make a group/organisation as well to keep everything organised! Encrypt your variables again and use the command ```ansible-playbook -i inventory.ini setup-repos.yml --ask-pass --ask-vault-pass --ask-become-pass --tags "create-group"```

- Now when you navigate to your groups tab in gitlab UI, you can see that you have a new group! Go to group settings and generate a group access token there and add it to your vars.yml file

- It's time to set up the groups and repositories, run ```ansible-playbook -i inventory.ini setup-repos.yml --ask-pass --ask-vault-pass --ask-become-pass --skip-tags "create group"``` to make all the repositories.

![gitlab repos](https://imgur.com/a/VwkBBBg)

- Next up, is making sure we have the runners set for each service CI/CD pipeline, we made a chocie to register them manually due to Gitlabs new update on runner registration system.

    1. Navigae to groups tab in the Gitlab UI and select the group that you have made.

    2. Go through each repository and navigate Settings -> CI/CD -> Runners and make a new runner, set the tag to docker and check "run untagged jobs" and "Protected" 

    3. Copy the runner token and SSH into your Gitlab server instance

    4. Paste the following command into your terminal and switch out the variables, the rest will be taken care of the templates I have prepared.
    ```bash
      sudo gitlab-runner register --non-interactive \
          --template-config /tmp/config_templates/{{ item.name }}_runner.template.toml \
          --url "http://{{ gitlab_external_url }}" \
          --token "{{ gitlab_personal_access_token }}" \
          --executor "{{ gitlab_ci_runner_executor }}" \
          --description "{{ item.name }}-runner" \
          --tag-list "docker" \
          --run-untagged=true \
          --docker-privileged
    ``` 
- To finish up the set up lets set up the variables for our pipelines.

    1. Navigate to Groups -> your group -> Group settings -> CI/CD -> Variables and there you can add all the variables.
    
    2. Make sure to mask, hide and protect all the sensitive variables!!!

### Step 2. Pushing the code to respective repositories

- Now that you have successfully set up Gitlab, push the microservices and apps to their respective repositories.

- You can now start to see the magic of the pipeline in action!

- Wait for the jobs to finish untill deploy_staging(which has been configured to manual start)

![gitlab-pipeline](https://imgur.com/a/Vrm5Ak3)

### Step 3. Setting up the staging Cloud (this is the costly part, proceed at your own risk)

- Go to your infra pipeline and wait for it to finish all the automatic stages, now you will have the option to launch the staging(testing) environment for your services, once you start the job and wait for it to finish, you are now capable of hosting your own microservices there!

- To launch the services for testing, you need to configure your kubectl tool to connect to the right place, use this command to do just that! ```aws eks update-kubeconfig --name staging-main-cluster --region eu-north-1```

- Now you can start the microservices by setting the environment by ```kubectl apply -k .``` and launching the services with ```kubectl apply -f ./manifests```

- If you run ```kubectl get pods``` then you should see all your servi

- To fully test the CI/CD pipeline, try changing something in the readme of the app or perhaps console.log something different in the code and push it.

- The service should go through the pipeline and get build, tested, scanned and finally pushed to dockerhub automatically and now you can do manual QA testing on it.

- To launch everything in production just go to the infra repository and set manually start the production cloud.

- Now the last remaining step is to spin up all of the services by running 
```bash
aws eks update-kubeconfig --name prod-main-cluster --region eu-north-1
kubectl apply -k .
kubectl apply -f ./manifests
``` 

![pod demo](./assets/Screenshot%202024-11-07%20001306.png)


## Audit roleplay section

### Can you explain the concept of DevOps and its benefits for the software development lifecycle?

- DevOps is approach that combines software development(Dev) with IT operations(Ops)
- It promotes a culture of collaboration between development and operations teams, eliminating silos.
- Benefits include faster release cycles, higher-quality software, reduced failure rates, and a quicker time-to-recovery for incidents.
- DevOps ultimately shortens the development lifecycle while improving system stability and quality.

### How do DevOps principles help improve collaboration between development and operations teams?

- Automation of repetitive tasks
- Shared responsibility & accountability.
- Continous feedback loops

### What are some common DevOps practices, and how did you incorporate them into your project? How does automation play a key role in the DevOps process, and what tools did you use to automate different stages of your project?

- Configuration management: used ansible and terraform for provisioning
  - Terraform was used to define and provision infrastructure on AWS.
  - Ansible complemented Terraform by handling server configuration after infra provisioning(install packages, manage users, apply security settings)
- Continous Integration(CI): used gitlab actions to automatically build&test code.
- Continous Delivery(CD): Set up GitLab CI/CD to automate deployments to AWS EKS.
  Staging deployments are triggered after successful builds for end-to-end testing.
  Production deployments use a manual approval step, ensuring reviewed releases.
  Both environments use rolling deployments for zero-downtime updates.

### Can you discuss the role of continuous integration and continuous deployment (CI/CD) in a DevOps workflow, and how it helps improve the quality and speed of software delivery?

- Improved Collaboration: CI/CD practices encourage collaboration between development and operations teams, leading to a shared understanding of the software delivery process.
- Higher Quality Software: Continuous testing, integration, and deployment processes contribute to higher-quality software with fewer defects.

### Can you explain the importance of infrastructure as code (IaC) in a DevOps environment, and how it helps maintain consistency and reproducibility in your project?

- IaC automates the provisioning and management of infrastructure resources, reducing the need for manual configuration. This speeds up the setup of environments(no need for 'Click-Ops') and minimizes human error.

- Infrastructure definitions are stored in version control systems (like Git), allowing teams to track changes over time. This provides a clear history of what changes were made, when, and by whom, which is crucial for auditing and troubleshooting.

- Consistency across environments: By using code to define infrastructure, teams can ensure that development, testing, and production environments are identical. This eliminates discrepancies that often lead to "it works on my machine" issues.

- Reproducibility: With IaC, environments can be recreated consistently and easily. If an environment is lost or needs to be replicated, the same code can be executed to rebuild it exactly as before.

### How do DevOps practices help improve the security of an application, and what steps did you take to integrate security into your development and deployment processes?

- Security Scanning: Integrated Snyk into the CI/CD pipeline to automate vulnerability scanning for both the application code and Docker images. This proactive approach helps identify and remediate security vulnerabilities early in the development process, reducing the risk of deploying insecure applications.

- Early Detection: By running Snyk tests during the CI stage, we ensured that vulnerabilities were detected immediately upon code changes. This immediate feedback loop allows developers to address security issues before they reach production.

### What challenges did you face when implementing DevOps practices in your project, and how did you overcome them?

- Skill gaps in specific DevOps tools & practices - adressed by education.
- Who is reading this anyways?
- Setting up prod/staging environments - solved by using terraform workspaces.
- Unpaid AWS bills - made new bank account & amazon account & moved to Belize

### How can DevOps practices help optimize resource usage and reduce costs in a cloud-based environment?

- Scaling on demand.
- Cost monitoring
- Containerization
- Monitoring & Optimizing performance

### Can you explain the purpose and benefits of using GitLab and GitLab Runners in your project, and how they improve the development and deployment processes?

- GitLabs merge&issue tracking features facilitate collaboration among team members
- Automated workflows: GitLab runners automate building/testing and deploying applications + security scanning.

### What are the advantages of using Ansible for automation in your project, and how did it help you streamline the deployment of GitLab and GitLab Runners?

- In our project ansible is used to automatically set up gitlab+gitlab runners, ensuring the setup is performed consistently.
- By using Gitlab API, project repositories are created automatically, reducing the need for manual tinker.
- Used ansible-vault for secure management of sensitive information

### Can you explain the concept of Infrastructure as Code (IaC) and how you implemented it using Terraform in your project?

- Infrastructure as Code (IaC) is a practice that involves managing and provisioning computing infrastructure through machine-readable configuration files rather than physical hardware configuration or interactive configuration tools.
- We use Terraform to provision various resources on AWS for different environments—specifically production (prod) and staging. Terraform workspaces were used.

### What is the purpose of using continuous integration and continuous deployment (CI/CD) pipelines, and how did it help you automate the building, testing, and deployment of your application?

- Continuous Integration (CI) and Continuous Deployment (CD) are practices that aim to improve software development by automating the processes of building, testing, and deploying applications.

- By having gitlab runners, all testing&deployment is automatical.

### How did you ensure the security of the application throughout the pipeline stages?

- By using tools like Snyk and npm audit command. Snyk scans your project for known vulnerabilities and npm audit makes sure there are no deprecated packages in your project

- We used various encrypting tools for our secrets like kuberenetes secrets and ansible-vault to make sure that no keys or sensitive variables were revealed or uploaded to cloud services.

- Setting permissions as needed, only the neccessary amount to limit any attacks that may occur with with loose permissions.

- Strong passwords and password managers :D

### Can you explain the continuous integration (CI) pipeline you've implemented for each repository?

- Build: We build the neccessary environment for our containers by using npm install and storing the node modules for next stages

- Test: Here the unit tests are ran to ensure our services will work.

- Scan: In this stage we check our code and dependencies with Snyk to ensure that our code is free of vulnerabilities

- Build_image(Containerization): This stage contains everything related to docker. First we build our Docker image and then we push it to our Docker hub repositories and tag them with our commit_sha for version control incase the latest version is not stable, we can manually use the previous one that worked and roll back our updates. 

### Can you explain the continuous deployment (CD) pipeline you've implemented for each repository?

- Here we chose to use ```kubectl rollout``` feature that lets us smoothly go over to the newer version of our services. Or incase our newest udate fails, we can roll it back with the same feature that makes everything seemless by handling the restart of the containers automatically.