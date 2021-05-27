---
title: 算法篇-BFPRT算法
index_img: https://cdn.jsdelivr.net/gh/mikeygithub/jsDeliver@master/resource/img/bfprt-logo.png
date: 2020-11-30 16:36:50
category: 算法学习
tags: 算法
---


# 背景介绍

>中位数的中位数算法

在一堆数中求其前 k 大或前 k 小的问题，简称 TOP-K 问题。而目前解决 TOP-K 问题最有效的算法即是 **BFPRT 算法**，又称为**中位数的中位数算法**，该算法由 Blum、Floyd、Pratt、Rivest、Tarjan 提出，最坏时间复杂度为 `O(n)`。

在首次接触 TOP-K 问题时，我们的第一反应就是可以先对所有数据进行一次排序，然后取其前 k 即可，但是这么做有两个问题：

1. 快速排序的平均复杂度为 `O(nlogn)`，但最坏时间复杂度为 `O(n^2)`，不能始终保证较好的复杂度；
2. 我们只需要前 k 大的，而对其余不需要的数也进行了排序，浪费了大量排序时间。

除这种方法之外，堆排序也是一个比较好的选择，可以维护一个大小为 k 的堆，时间复杂度为 `O(nlogk)`。

那是否还存在更有效的方法呢？我们来看下 BFPRT 算法的做法。

**在快速排序的基础上**，首先通过判断主元位置与k的大小使递归的规模变小，其次通过修改快速排序中**主元的选取方法**来降低快速排序在**最坏情况下的时间复杂度**。

下面先来简单回顾下快速排序的过程，以升序为例：

````
1. 选取主元；
2. 以选取的主元为分界点，把小于主元的放在左边，大于主元的放在右边；
3. 分别对左边和右边进行递归，重复上述过程。
````

# 算法过程

BFPRT 算法步骤如下：

>1.将序列中所有元素按5个元素一组进行划分，最后一组可能少于5个元素，对每一组元素进行插入排序选出中间的元素即为中位数；
 
>2.对所有中位数重复步骤1，即对中位数进行分组，求得它们的中位数；重复此步骤，直到只有一个中位数；
 
>3.遍历序列，得到该中位数的下标；
 
>4.以该中位数作为pivot，对序列进行Partion划分过程，返回划分后的中位数的下标；
 
>5.根据下标得出当前中位数是第X小元素，判断X是否等于K，若是则表明该中位数即为第K小元素，返回下标；否则，判断X是否大于K，若是，则从中位数左边的元素中找出第K小元素；否则，从中位数右边的元素中找出第K-x小元素（因为经过Partion后，中位数左边的元素都小于等于该中位数）。


下面为代码实现，其所求为**前 k 小的数**：

<details>
  <summary><span>代码</span></summary>
  <br>


```cgo
#include <iostream>
using namespace std;
 
// 插入排序  
void insertSort(int R[], int low, int high) {
	int i, j, tmp;
	for (i = low + 1; i <= high; ++i) {
		tmp = R[i];
		j = i - 1;
		while (j >= low && R[j] > tmp) {
			R[j + 1] = R[j];
			--j;
		}
		R[j + 1] = tmp;
	}
}
 
// 递归寻找中位数的中位数  
int FindMid(int R[], int low, int high) {
	// 只有一个元素
	if (low == high) {
		return R[low];
	}
	int i, k;
	// 将序列划分为5个元素一组，分别求取中位数
	for (i = low; i + 4 <= high; i += 5) {
		insertSort(R, i, i + 4);
		k = i - low;
		// 将中位数交换到前面
		swap(R[low + k / 5], R[i + 2]);
	}
	int n = high - i + 1;
	// 最后一组不足5个元素
	if (n > 0) {
		insertSort(R, i, high);
		k = i - low;
		swap(R[low + k / 5], R[i + n / 2]);
	}
	k = k / 5;
	// 只有一个中位数
	if (k == 0) {
		return R[low];
	}
	return FindMid(R, low, low + k);
}
 
// 寻找中位数的所在位置  
int FindId(int R[], int low, int high, int median) {
	for (int i = low; i <= high; ++i) {
		if (median == R[i]) {
			return i;
		}
	}
	return -1;
}
 
//进行划分过程  
int Partion(int R[], int low, int high, int index) {
	if (low <= high) {
		// 将中位数与第1个元素交换
		swap(R[index], R[low]);
		int tmp = R[low];
		int i = low, j = high;
		// 将小于中位数的元素交换到中位数的左边，大于中位数的元素交换到中位数的右边
		while (i != j) {
			while (j > i&&R[j] >= tmp) {
				--j;
			}
			R[i] = R[j];
			while (i < j&&R[i] <= tmp) {
				++i;
			}
			R[j] = R[i];
		}
		R[i] = tmp;
		return i;
	}
	return -1;
}
 
int BFPTR(int R[], int low, int high, int K){
	// 中位数
	int median = FindMid(R, low, high);
	// 中位数下标
	int index = FindId(R, low, high, median);
	// 划分，得到中位数新的下标
	int newIndex = Partion(R, low, high, index);
	// 中位数在当前序列[low..high]中的位置
	int rank = newIndex - low + 1;
	if (rank == K) {
		// 中位数是第K小元素
		// 左边的K个元素（包括中位数）为Top-K
		// 返回中位数下标
		return newIndex;
	}
	else if (rank > K) {
		return BFPTR(R, low, newIndex - 1, K);
	}
	return BFPTR(R, newIndex + 1, high, K - rank);
}
```


</details>

<br>

<details>
  <summary><span>代码测试</span></summary>
  <br>

```cgo
int main(int argc, char** argv)
{
    const int N = 12;
    int i;
    int R[] = { 12, 1, 8, 10, 6, 2, 5, 9, 11, 3, 4, 7 };
    cout << "原始数据：";
    for (i = 0; i < N; ++i)
    {
        cout << R[i] << " ";
    }
    cout << endl << endl;
    int K, index;
    int R1[N];
    for (int t = 1; t <= 12; ++t)
    {
        K = t;
        for (i = 0; i < N; ++i)
        {
            R1[i] = R[i];
        }
        index = BFPTR(R1, 0, N - 1, K);
        cout << "处理后的数据：";
        for (i = 0; i < N; ++i)
        {
            cout << R1[i] << " ";
        }
        cout << endl;
        cout << "第" << K << "小元素：" << R1[index] << endl;
        cout << "Top-" << K << " 的数据：";
        // 对Top-K元素进行排序，方便查看
        insertSort(R1, index - K + 1, index);
        for (i = index - K + 1; i <= index; ++i)
        {
            cout << R1[i] << " ";
        }
        cout << endl << endl;
    }
    return 0;
}
```

运行如下：

```
原始数据：12 1 8 10 6 2 5 9 11 3 4 7
 
处理后的数据：1 2 3 4 6 5 7 12 9 11 10 8
第1小元素：1
Top-1 的数据：1
 
处理后的数据：1 2 3 4 6 5 7 12 9 11 10 8
第2小元素：2
Top-2 的数据：1 2
 
处理后的数据：1 2 3 4 6 5 7 12 9 11 10 8
第3小元素：3
Top-3 的数据：1 2 3
 
处理后的数据：3 2 1 4 6 5 7 12 9 11 10 8
第4小元素：4
Top-4 的数据：1 2 3 4
 
处理后的数据：3 2 1 4 5 6 7 12 9 11 10 8
第5小元素：5
Top-5 的数据：1 2 3 4 5
 
处理后的数据：3 2 1 4 5 6 7 12 9 11 10 8
第6小元素：6
Top-6 的数据：1 2 3 4 5 6
 
处理后的数据：1 5 4 6 3 2 7 12 9 11 10 8
第7小元素：7
Top-7 的数据：1 2 3 4 5 6 7
 
处理后的数据：1 5 4 6 3 2 7 8 9 10 11 12
第8小元素：8
Top-8 的数据：1 2 3 4 5 6 7 8
 
处理后的数据：1 5 4 6 3 2 7 8 9 10 11 12
第9小元素：9
Top-9 的数据：1 2 3 4 5 6 7 8 9
 
处理后的数据：1 5 4 6 3 2 7 8 9 10 11 12
第10小元素：10
Top-10 的数据：1 2 3 4 5 6 7 8 9 10
 
处理后的数据：1 5 4 6 3 2 7 8 9 10 11 12
第11小元素：11
Top-11 的数据：1 2 3 4 5 6 7 8 9 10 11
 
处理后的数据：1 5 4 6 3 2 7 8 9 10 11 12
第12小元素：12
Top-12 的数据：1 2 3 4 5 6 7 8 9 10 11 12
```

</details>



# 时间复杂

BFPRT 算法在最坏情况下的时间复杂度是 O(n)，下面予以证明。令 T(n) 为所求的时间复杂度，则有：

`T(n)≤T(n 5)+T({7n}{10})+c⋅n {c 为一个正常数}`

其中：

- T(n/5)来自 GetPivotIndex()，n 个元素，5 个一组，共有 ⌊n/5⌋ 个中位数；
- T(7n/10) 来自 BFPRT()，在 ⌊n/5⌋ 个中位数中，主元 x 大于其中 1/2⋅ n/5=n/10 的中位数，而每个中位数在其本来的 5 个数的小组中又大于或等于其中的 3 个数，所以主元 x 至少大于所有数中的 n/10\*3=3n/10 个。即划分之后，任意一边的长度至少为 3/10，在最坏情况下，每次选择都选到了 7/10 的那一部分。
- c⋅n 来自其它操作，比如 InsertSort()，以及 GetPivotIndex() 和 Partition() 里所需的一些额外操作。

其中 c 为一个正常数，故t也是一个正常数，即 T(n)≤10c⋅n，因此 `T(n)=O(n)`。

接下来我们再来探讨下 BFPRT 算法为何选 5 作为分组主元，而不是 2, 3, 7, 9 呢？

首先排除偶数，对于偶数我们很难取舍其中位数，而奇数很容易。再者对于 3 而言，会有 T(n)≤T(\frac n 3)+T({2n}3)+c⋅n，它本身还是操作了 n 个元素，与以 5 为主元的 {9n}{10}10 相比，其复杂度并没有减少。对于 7，9，... 而言，上式中的 10c，其整体都会增加，所以与 5 相比，5 更适合。

# 参考文献

- [算法导论]()
- [Median of medians](https://en.wikipedia.org/wiki/Median_of_medians).维基百科
- [bfprt算法解析](https://blog.csdn.net/qq_40938077/article/details/81213820)
- [bfprt算法](https://blog.csdn.net/softimite_zifeng/article/details/77103544)


 