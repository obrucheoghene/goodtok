/*
 * Copyright (C) 2023 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/goodtok
 *
 * This file is part of Goodtok
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as SDK from "@goodtok/sdk";
import { useParams } from "react-router-dom";
import { useAuth } from "~authentication";
import { QueuePage } from "~components/queue/QueuePage";
import { useLogger } from "~logger";
import React, { useEffect } from "react";
import moment from "moment";

const mapQueueEntry = (entry: {
  customerId: string;
  customer: {
    name: string;
    note: string;
  };
  createdAt: Date;
  status: string;
  aor: string;
}) => {
  return {
    id: entry.customerId,
    name: entry.customer.name,
    note: entry.customer.note,
    time: moment(entry.createdAt).fromNow(),
    isOnline: entry.status === "ONLINE",
    aor: entry.aor
  };
};

function WorkspaceContainer() {
  const [name, setName] = React.useState("");
  const [avatar, setAvatar] = React.useState("");
  const [storeURL, setStoreURL] = React.useState("");
  const [workspaceName, setWorkspaceName] = React.useState("");
  const [avgWaitTime] = React.useState("");
  // Fix this any
  const [peopleList, setPeopleList] = React.useState<any[]>([]);
  const [isOnline, setIsOnline] = React.useState(false);

  const { id: workspaceId } = useParams() as { id: string };
  const { client, signOut, isSignedIn } = useAuth();
  const logger = useLogger();

  if (!client) {
    signOut();
    return;
  }

  useEffect(() => {
    const users = new SDK.Users(client);
    users
      .getCurrentUser()
      .then((user) => {
        setName(user.name);
        setAvatar(user.avatar);
      })
      .catch((err) => {
        logger.error("err getting current user", err);
      });
  });

  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = "/login";
    }
  });

  useEffect(() => {
    const workspaces = new SDK.Workspaces(client);
    workspaces
      .getWorkspaceById(workspaceId)
      .then((workspace) => {
        setStoreURL(workspace.shopifyAccount?.storeDomain as string);
        setWorkspaceName(workspace.name);
      })
      .catch((err) => {
        logger.error("err getting workspace", err);
      });

    workspaces
      .getQueueByWorkspaceId(workspaceId)
      .then((response: { queue: SDK.QueueEntry[] }) => {
        setPeopleList(response.queue.map((entry) => mapQueueEntry(entry)));
      })
      .catch((err) => {
        logger.error("err getting queue", err);
      });

    workspaces.watchQueue(workspaceId, (err, person) => {
      if (err) {
        logger.error("failed to watch queue:", err);
        return;
      }

      setPeopleList((peopleList) => {
        const newPeopleList = peopleList.filter(
          (p) => p.id !== person?.customerId
        );
        return [...newPeopleList, mapQueueEntry(person as SDK.QueueEntry)];
      });
    });
  }, [client, workspaceId]);

  useEffect(() => {
    const workspaces = new SDK.Workspaces(client);
    workspaces.watchWorkspaceStatus(workspaceId, (err, status) => {
      if (err) {
        logger.error("failed to watch workspace status:", err);
        return;
      }

      setIsOnline(status?.online as boolean);
    });
  });

  const handleQueueEntrySelect = (id: string, aor: string) => {
    window.location.href = `/workspace/${workspaceId}/s/${id}/aor/${aor}`;
  };

  const handleOnlineChange = (newOnlineStatus: boolean) => {
    const workspaces = new SDK.Workspaces(client);
    const status = newOnlineStatus ? "ONLINE" : "OFFLINE";
    workspaces.updateWorkspace({ id: workspaceId, status });
    setIsOnline(newOnlineStatus);
  };

  return (
    <QueuePage
      workspaceId={workspaceId}
      userName={name}
      avatar={avatar}
      storeURL={storeURL}
      workspaceName={workspaceName}
      avgWaitTime={avgWaitTime}
      data={peopleList}
      isAuthenticated={true}
      isOnline={isOnline}
      onQueueEntrySelect={handleQueueEntrySelect}
      onOnlineStatusChange={handleOnlineChange}
      onSignOut={signOut}
    />
  );
}

export default WorkspaceContainer;
