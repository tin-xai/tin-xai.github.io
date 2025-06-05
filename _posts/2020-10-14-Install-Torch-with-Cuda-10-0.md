---
layout: post
title: Install Torch with Cuda 10.0
subtitle: Nvidia
gh-repo: daattali/beautiful-jekyll
gh-badge: [settings]
tags: [cuda, nvidia, ubuntu]
comments: true

---
Hi các bạn, ở bài viết này mình sẽ hướng dẫn các bạn cách cài đặt Torch và cách làm sao để  Torch làm việc với Cuda 10.0
# In the terminal, run the commands WITHOUT sudo
git clone https://github.com/torch/distro.git ~/torch --recursive <br/>
cd ~/torch <br/>
bash install-deps <br/>

Ở bước này các bạn có thể  gõ : <br/>
./install.sh để cài đặt, nhưng nó chỉ làm việc với cuda 5.0 <br/>

Vì vậy, nếu muốn làm việc với cuda 10.0, bạn sẽ làm thêm những bước sau đây :
1. Install the latest CMake from github repo (the latest FindCUDA.cmake will be installed) <br/>
sudo apt-get purge cmake <br/>
git clone https://github.com/Kitware/CMake.git <br/>
cd CMake <br/>
./bootstrap <br/>
make && sudo make install 

2. Xóa FindCUDA.cmake. <br/>
cd ~/torch <br/>
rm -fr cmake/3.6/Modules/FindCUDA*

3. Vá lối (patch) cho cutorch <br/>
diff --git a/lib/THC/THCAtomics.cuh b/lib/THC/THCAtomics.cuh <br/>
index 400875c..ccb7a1c 100644 <br/>
--- a/lib/THC/THCAtomics.cuh <br/>
+++ b/lib/THC/THCAtomics.cuh <br/>
@@ -94,6 +94,7 @@ static inline __device__ void atomicAdd(long *address, long val) { <br/>
 } <br/>
 
 #ifdef CUDA_HALF_TENSOR <br/>
+#if !(__CUDA_ARCH__ >= 700 || !defined(__CUDA_ARCH__) ) <br/>
 static inline  __device__ void atomicAdd(half *address, half val) { <br/>
   unsigned int * address_as_ui = <br/>
       (unsigned int *) ((char *)address - ((size_t)address & 2)); <br/>
@@ -117,6 +118,7 @@ static inline  __device__ void atomicAdd(half *address, half val) { <br/>
    } while (assumed != old); <br/>
 } <br/>
 #endif <br/>
+#endif <br/>

cd extra/cutorch <br/>
cat > atomic.patch <br/>
<copy and paste the patch> <br/>
patch -p1 < atomic.patch <br/>

4. Build <br/>
 ./clean.sh <br/>
export TORCH_NVCC_FLAGS="-D__CUDA_NO_HALF_OPERATORS__" <br/>
./install.sh

5. Install Cudnn <br/>
git clone https://github.com/soumith/cudnn.torch -b R7 <br/>
cd cudnn.torch <br/>
luarocks make cudnn-scm-1.rockspec <br/>

[Source](https://github.com/torch/cutorch/issues/834) <br/>
