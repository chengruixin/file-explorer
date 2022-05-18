package main

import (
	"fmt"
	"goserver/pkg/similarity"
)

func main() {
	str := "abcde efg, hkl"

	fmt.Println(similarity.NewShingleExecutor(str, 3).ShingleValueComplex())
}

// func getSigs(str string, hashFuncs []*similarity.HashFuncProps) []int {
// 	windowLen := 2
// 	shingles := similarity.NewShingleExecutor(str, windowLen).TrimUnnecessary().RemoveRepeated().ShingleValue()

// 	oneHotVLoc := similarity.OneHotVectorLocation(shingles, windowLen)

// 	sigs := similarity.MinHash(oneHotVLoc, hashFuncs, 26*26)
// 	return sigs
// }

// func
