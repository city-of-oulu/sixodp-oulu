
# Installing the service on a plain Virtual Server

Prerequisites for the control host:

- Ansible 2.x (tested on 2.2)
- zip command available

Prerequisites for the target host:

- 64-bit Ubuntu 16.04 virtual machine (4GB RAM, equivalent to EC2 t2.medium)
- Python 2. Note that Ubuntu 16.04 does not have it anymore by default. You need to install it with `sudo apt-get install python-minimal`
- Ports 80 and 443 accessible from everywhere, port 22 accessible from your IP address
- SSH access with key-based authentication
- Linux user with sudo rights without password prompt

## Setup configuration files

Create copies of the following configuration files and modify them to suit your case:

**ansible/inventories/example_singleserver**

- Update server hostname
- Update linux username
- Give a unique name for your server environment
- Update path to secrets file

**ansible/vars/environment-specific/example_singleserver.yml**

- Update `public_facing_hostname`
- Update `fqdn_common_part` if using self-signed certificates

**ansible/vars/secrets-defaults.yml**

- Generate strong passwords
- Generate a UUID4 for the variable `app_instance_uuid`

NOTE: Save the secrets outside of the repository to avoid accidentally publishing them!

## Run Ansible

In the ansible directory, run:

    ansible-playbook -v -i inventories/yourenvironment deploy-all.yml

If your secrets file is an Ansible vault, you need to pass the `--ask-vault-pass` argument.