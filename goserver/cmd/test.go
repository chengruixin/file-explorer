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

	worker1 := similarity.NewLSHWorker(200, 2, 2)
	worker2 := similarity.NewLSHWorker(200, 2, 2)
	worker3 := similarity.NewLSHWorker(200, 2, 2)

	worker1.MultiAddText(strs)
	worker2.MultiAddText(strs)
	worker3.MultiAddText(strs)

	for _, t := range tested {
		res := append(worker1.FindCandidates(t), append(worker2.FindCandidates(t), worker3.FindCandidates(t)...)...)
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
