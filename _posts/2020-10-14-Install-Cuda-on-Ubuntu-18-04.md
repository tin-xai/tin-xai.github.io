---
layout: post
title: Install Cuda on Ubuntu 18.04
subtitle: Nvidia
gh-repo: daattali/beautiful-jekyll
gh-badge: [settings]
tags: [cuda, nvidia, ubuntu]
comments: true

---
Hi các bạn, ở bài viết này mình sẽ hướng dẫn các bạn cách cài đặt Cuda trên Ubuntu 18.04
<b>1. Start terminal and remove any NVIDIA traces you may have on your machine.</b>

sudo rm /etc/apt/sources.list.d/cuda* <br/>
sudo apt remove --autoremove nvidia-cuda-toolkit <br/>
sudo apt remove --autoremove nvidia-* <br/>

<b>2. Setup the correct CUDA PPA on your system </b>

sudo apt update <br/>
sudo add-apt-repository ppa:graphics-drivers<br/>
sudo apt-key adv --fetch-keys  http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub<br/>
sudo bash -c 'echo "deb http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64 /" > /etc/apt/sources.list.d/cuda.list'<br/>
sudo bash -c 'echo "deb http://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64 /" > /etc/apt/sources.list.d/cuda_learn.list'<br/

<b>3. Install CUDA 10.1 packages </b>

sudo apt update<br/>
sudo apt install cuda-10-1<br/>
sudo apt install libcudnn7<br/>

or sudo apt install libcudnn10<br/>

<b>4. As the last step one need to specify PATH to CUDA in ‘.profile’ file. Open the file by running: </b>

sudo vi ~/.profile <br/>

And add the following lines at the end of the file to set PATH for cuda 10.1 installation: <br/>

if [ -d "/usr/local/cuda-10.1/bin/" ]; then <br/>
    export PATH=/usr/local/cuda-10.1/bin${PATH:+:${PATH}} <br/>
    export LD_LIBRARY_PATH=/usr/local/cuda-10.1/lib64${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}} <br/>
fi <br/>
<b>5. Restart and check the versions for the installation  </b>


[Source](https://medium.com/@exesse/cuda-10-1-installation-on-ubuntu-18-04-lts-d04f89287130)