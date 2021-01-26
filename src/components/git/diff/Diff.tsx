import React, { useEffect, useState } from "react";
import { ReactGhLikeDiff } from "react-gh-like-diff";
import "./diff.css"
import { useBehaviorSubject } from "use-subscribable";
import { gitservice, Utils } from "../../../App";

interface DiffProps {}

export const DiffView: React.FC<DiffProps> = ({}) => {
  const [mock, setMock] = useState("");
  const diffs = useBehaviorSubject(gitservice.diffResult);

  gitservice.diffResult.subscribe((x) => Utils.log("diff", x)).unsubscribe();

  return (
    <div className='container-fluid'>
      {diffs?.map((diff) => {
        return (
           
          <ReactGhLikeDiff key={diff.originalFileName}
            options={{
              originalFileName: diff?.originalFileName,
              updatedFileName: diff?.updatedFileName,
            }}
            past={diff?.past}
            current={diff?.current}
          />
         
        );
      })}
      {diffs?.length===0?<>Nothing to see here.</>:<></>}
 </div>
  );
};
