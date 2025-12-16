import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui.shadcn/card';
import { Button } from '@/components/ui.shadcn/form/button';
import { Input } from '@/components/ui.shadcn/form/input';
import { Label } from '@/components/ui.shadcn/form/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui.shadcn/tabs';

const meta: Meta<typeof Tabs> = {
  title: 'ui.shadcn / Tabs',
  component: Tabs,
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Tabs defaultValue="account" style={{ width: 400 }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  ),
};
