import useProject from "@/hooks/use-project";
import { useIndexingEvents } from "@/hooks/use-indexingEvents";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Indexer } from "./indexer";

function ProjectIndexingPage() {
  const searchParams = useSearchParams();
  const { projectId } = useProject();
  const {
    status,
    message,
    progress,
    current,
    total,
    currentFile,
    error,
    stats,
    logs,
    startIndexing,
  } = useIndexingEvents();

  useEffect(() => {
    if (
      searchParams?.get("index") === "true" &&
      projectId &&
      status === "pending"
    ) {
      setIsIndexingModalOpen(true);
      startIndexing(projectId);
    }
  }, [projectId, searchParams, startIndexing, status]);

  const [isIndexingModalOpen, setIsIndexingModalOpen] = React.useState(false);
  return (
    <>
      {isIndexingModalOpen && (
        <Dialog
          open={isIndexingModalOpen}
          onOpenChange={setIsIndexingModalOpen}
        >
          <DialogHeader>
            <DialogTitle>Indexer</DialogTitle>
          </DialogHeader>

          <DialogContent
            className="h-[80vh] w-[60vw] max-w-full max-h-screen p-0"
            onInteractOutside={(e) => {
              // Check if the process is currently running
              const isProcessing = [
                "pending",
                "cloning",
                "processing",
                "saving",
              ].includes(status);
              if (isProcessing) {
                e.preventDefault();
              }
            }}
          >
            <Indexer
              status={status} // status of the indexing process
              progress={progress} // progress percentage
              stats={stats} // statistics {totalFiles, embeddingGenerated, savedToDatabase, failed, processingTimeSecons}
              message={message} // current status message
              current={current} // current file index being processed
              total={total} // total number of files to process
              currentFile={currentFile} // name of the current file being processed
              error={error} // error message if any
              logs={logs} // array of all indexing progress logs
              startIndexing={startIndexing} // function to start indexing
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default ProjectIndexingPage;
