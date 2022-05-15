package similarity

func numHash(nums []int) int64 {
	res := int64(0)

	for i, num := range nums {
		res += int64(pow(num, i+1))
	}

	return res
}

func pow(base int, power int) int {
	res := 1
	for i := 0; i < power; i++ {
		res *= base
	}
	return res
}

func RemoveRepeated[K comparable](arr []K) []K {
	lookup := make(map[K]bool)
	res := make([]K, 0)

	for _, item := range arr {
		if !lookup[item] {
			res = append(res, item)
			lookup[item] = true
		}
	}

	return res
}
