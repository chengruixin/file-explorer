package main

import (
	"fmt"
	"goserver/pkg/similarity"
)

func main() {
	strs := []string{
		"I am a text with some texts and I dont know what to talk",
		"Here is another one text ",
		"Another one, but short",
		"Remind that labels and other not english letters symbols are not counted in this algo",
		"Remind that only english letters will be labels and other counted in this algo",
		"SPLU-zxc",
		"SPLU-sef",

		"SPLU-xdf",

		"SPLU-abc",

		"SPLU-adb",
	}

	tested := []string{
		"Remind that only english letters symbol are not counted",
		"another one",
		"continuing",
		"splu",
	}

	lshWorker := similarity.BuildStorage(strs)

	ress := similarity.Test(lshWorker, tested)

	// fmt.Println(ress)

	for _, res := range ress {
		fmt.Println(similarity.RemoveRepeated(res))
	}
}

// func getSigs(str string, hashFuncs []*similarity.HashFuncProps) []int {
// 	windowLen := 2
// 	shingles := similarity.NewShingleExecutor(str, windowLen).TrimUnnecessary().RemoveRepeated().ShingleValue()

// 	oneHotVLoc := similarity.OneHotVectorLocation(shingles, windowLen)

// 	sigs := similarity.MinHash(oneHotVLoc, hashFuncs, 26*26)
// 	return sigs
// }

// func
