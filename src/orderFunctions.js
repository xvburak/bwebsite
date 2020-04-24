import { projectList, projectArray } from './stores.js';

let projectList_value = projectArray;

// projectList.subscribe((value) => {
// 	projectList_value = value;
// });

export const getNext = function (posToCheck) {
	// console.log(
	// 	'position getNext is checking: Project: ' +
	// 		posToCheck.project +
	// 		' Story: ' +
	// 		posToCheck.story
	// );
	let nextPos = { project: 0, story: 0 };
	nextPos.project = posToCheck.project; //start by setting a new variable to what we're checking against
	nextPos.story = posToCheck.story; //start by setting a new variable to what we're checking against
	//is the error that this basically *makes* nextPos $currentPos? like the whole object? and it updates?
	if (
		//if it's not the last story in a project
		posToCheck.story <
		projectList_value[posToCheck.project].stories.length - 1
	) {
		nextPos.story++; //add 1 to story value
	} else {
		//if it's the last story in a project
		if (posToCheck.project < projectList_value.length - 1) {
			//if it's not the last project
			nextPos.project++; //add 1 to story value
			nextPos.story = 0; //reset story to beginning
		} else {
			//if it's the last project
			nextPos.story = 0; //reset story to beginning
			nextPos.project = 0; //reset project to beginning;
		}
	}
	return nextPos;
};

export const getPrev = function (posToCheck) {
	let prevPos = { project: 0, story: 0 };
	prevPos.project = posToCheck.project; //start by setting a new variable to what we're checking against
	prevPos.story = posToCheck.story;
	if (
		//if it's not the first story in a project
		posToCheck.story > 0
	) {
		prevPos.story--;
	} else {
		//if it's the first story in a project
		if (posToCheck.project > 0) {
			//if it's not the first project
			prevPos.project--;
			prevPos.story =
				projectList_value[posToCheck.project - 1].stories.length - 1;
		} else {
			//if it's the first project
			prevPos.project = projectList_value.length - 1;
			prevPos.story =
				projectList_value[projectList_value.length - 1].stories.length - 1;
		}
	}
	return prevPos;
};
