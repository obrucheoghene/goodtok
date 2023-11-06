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
import type { Meta, StoryObj } from "@storybook/react";
import { AppBar } from "./AppBar";

/**
 * This story is for the AppBar component which is used to display the header of the application.
 */
const meta = {
  title: "FrontOffice/AppBar",
  component: AppBar,
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"],
  argTypes: {
    userName: {
      name: "User Name",
      description: "The name of the user",
      control: { type: "text" }
    },
    avatar: {
      name: "Avatar",
      description: "The avatar of the user",
      control: { type: "text" }
    },
    isAuthenticated: {
      name: "Is Authenticated",
      description: "Adds the user menu to the AppBar",
      control: { type: "boolean" },
      defaultValue: { summary: "false" }
    },
    onPersonalSettingsSelect: {
      name: "On Personal Settings Select",
      description: "Callback when the user selects the personal settings option",
      action: "clicked",
    },
    onWorkspaceSettingsSelect: {
      name: "On Workspace Settings Select",
      description: "Callback when the user selects the workspace settings option",
      action: "clicked",
    },
    onWorkspaceMembersSelect: {
      name: "On Workspace Members Select",
      description: "Callback when the user selects the workspace members option",
      action: "clicked",
    },
    onDocumentationSelect: {
      name: "On Documentation Select",
      description: "Callback when the user selects the documentation option",
      action: "clicked"
    },
    onSignOutSelect: {
      name: "On Sign Out Select",
      description: "Callback when the user selects the sign out option",
      action: "clicked"
    }
  }
} satisfies Meta<typeof AppBar>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic AppBar example.
 */
export const BasicAppBar: Story = {
  args: {
    userName: "Jane",
    avatar: "https://mui.com/static/images/avatar/3.jpg",
    isAuthenticated: false
  }
};

/**
 * AppBar example when the user is authenticated.
 */
export const AuthenticatedAppBar: Story = {
  args: {
    userName: "Jane",
    avatar: "https://mui.com/static/images/avatar/3.jpg",
    isAuthenticated: true
  }
};
