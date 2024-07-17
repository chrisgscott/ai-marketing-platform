"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientAvatarCreator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessType: "",
    targetAudience: "",
    keyProblems: "",
    desiredOutcomes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResponse(null);

    try {
      const response = await fetch("http://localhost:3001/api/client-avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Generated client avatar:", data);
      setResponse(data);

      // Store the avatar in localStorage
      localStorage.setItem("clientAvatar", JSON.stringify(data));

      // Redirect to the results page
      router.push("/generators/client-avatar/results");
    } catch (err) {
      console.error("Error details:", err);
      setError(
        "An error occurred while generating the client avatar. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Client Avatar Creator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="businessType" className="block mb-2 font-medium">
            What type of business do you run?
          </label>
          <input
            type="text"
            id="businessType"
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="targetAudience" className="block mb-2 font-medium">
            Describe your target audience:
          </label>
          <textarea
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="keyProblems" className="block mb-2 font-medium">
            What are the key problems your business solves?
          </label>
          <textarea
            id="keyProblems"
            name="keyProblems"
            value={formData.keyProblems}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="desiredOutcomes" className="block mb-2 font-medium">
            What outcomes do your clients desire?
          </label>
          <textarea
            id="desiredOutcomes"
            name="desiredOutcomes"
            value={formData.desiredOutcomes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Client Avatar"}
        </button>
        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Generating your client avatar...</p>
          </div>
        )}
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h2 className="font-bold mb-2">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      {response && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <h2 className="font-bold mb-2">Generated Client Avatar:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
