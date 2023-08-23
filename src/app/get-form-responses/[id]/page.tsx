import { Response } from "@/lib/schema/answerResponses";
import React from "react";

const GetResponses = async ({ params }: { params: { id: string } }) => {
  const path = process.env.WEB_URL;

  const response = await fetch(`${path}/api/get-form-responses/${params.id}`, {
    cache: "no-store",
  });
  const data = await response.json();
  const formResponses: Response[] = data.responses;

  return (
    <div className="container mx-auto py-10 bg-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">User Responses</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-800 ">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                User Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Answer
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {formResponses.length ? (
              formResponses.map((response, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {response.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {response.question}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {response.answer}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <h1>No Reponses Yet! </h1>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetResponses;
