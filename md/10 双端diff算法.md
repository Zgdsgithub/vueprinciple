<!--
 * @Author: zhanggd
 * @Date: 2022-10-25 16:11:42
 * @LastEditors: zhanggd
 * @LastEditTime: 2022-11-02 14:05:56
 * @Description: 第十章笔记
-->
# 10.1 简单diff的缺陷
1 2 3 转化为 3 1 2 理论上只需移动一次，但简单diff需要移动两次。因此出现双端diff。四个index代表新旧节点的首尾idnex，对比符合条件（key值相同）则进行移动，然后进入下一轮diff，直到对比完全部节点。

# 10.3 不是双端diff理想情况
有时在新旧节点首尾对比时不能找到key相同的元素，这时需要我们拿新节点首个元素与旧节点对比，再移动，然后再进行后续的diff

# 10.4 添加新元素
拿新节点首个元素与旧节点对比，有时是找不到的，证明此时这个首元素是新元素，需要我们添加