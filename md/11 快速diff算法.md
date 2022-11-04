<!--
 * @Author: zhanggd
 * @Date: 2022-10-25 16:11:42
 * @LastEditors: zhanggd
 * @LastEditTime: 2022-11-02 15:33:14
 * @Description: 第十一章笔记
-->
# 11.1 快速diff算法
相比前两个算法，快速diff算法性能更优。
思路：先预处理首尾相同的节点，然后构造最长子序列存储不需要移动的节点下标。
