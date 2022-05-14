package similarity

import (
	"math/rand"
	"time"
)

type HashFuncProps struct {
	coefficient int
	constant    int
}

func OneHotVector(shingles []string, shingleLength int) []int {
	vector := make([]int, pow(26, shingleLength))

	for _, shingle := range shingles {
		vector[getStringRelectedIndex(shingle)] = 1
	}

	return vector
}

func OneHotVectorLocation(shingles []string, shingleLength int) []int {
	location := []int{}

	for _, shingle := range shingles {
		location = append(location, getStringRelectedIndex(shingle))
	}

	return location
}

func getStringRelectedIndex(str string) int {
	powerBase := 0
	idx := 0
	for i := len(str) - 1; i >= 0; i-- {
		var remains int
		if 97 <= str[i] && str[i] <= 122 {
			remains = int(str[i]) - 97
		} else {
			remains = int(str[i]) - 65
		}

		idx += remains * (pow(26, powerBase))
		powerBase++
	}

	return idx
}

func GenerateHashFuncs(nums int) []*HashFuncProps {
	res := []*HashFuncProps{}
	rand.Seed(time.Now().UnixNano())
	min := 1
	max := 100

	for i := 0; i < nums; i++ {
		res = append(res, &HashFuncProps{rand.Intn(max) + min, rand.Intn(max) + min})
	}

	return res
}

func MinHash(vectorLocation []int, hashFuncs []*HashFuncProps, mod int) []int {
	signatures := []int{}
	for _, hashFunc := range hashFuncs {
		minSig := getMinSig(vectorLocation, hashFunc, mod)
		signatures = append(signatures, minSig)
	}
	return signatures
}

func getMinSig(vectorLocation []int, hashFunc *HashFuncProps, mod int) int {
	min := mod + 1
	for _, vIdx := range vectorLocation {
		r := (vIdx*hashFunc.coefficient + hashFunc.constant) % mod

		if r < min {
			min = r
		}
	}
	return min
}
