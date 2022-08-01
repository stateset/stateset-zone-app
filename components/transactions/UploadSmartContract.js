import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios, { post } from 'axios';


export default function UploadSmartContract(props) {


    const [file, setFile] = useState('');
    const [question, setQuestion] = useState('');
    const [examples, setExamples] = useState('');
    const [examples_context, setExamplesContext] = useState('');
    const [answer, setAnswer] = useState('');

    const [status, setStatus] = useState({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null }
    })

    // Handle Response

    const handleResponse = (status, msg) => {
      if (status === 200) {
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: msg }
        })
        setAnswer(msg)
      } else {
        setStatus({
          info: { error: true, msg: msg }
        })
      }
    }
    
    // Generate 

    const generateAnswer = async () => {
      setStatus(prevStatus => ({ ...prevStatus, submitting: true }))
      const res = await fetch('/api/ai/answer', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', 'token': token }),
        body: JSON.stringify({
          "question": question,
          "examples": examples,
          "examples_context": examples_context
        })
      });
      const gpt_text = await res.json()
      handleResponse(res.status, gpt_text.answers)
      console.log(gpt_text.answers)

    }

    // Upload 

    const upload = async (file) => {
    
        const url = "https://api.openai.com/v1/files";
        const formData = new FormData();
        formData.append('purpose', 'answers')
        formData.append('file', file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,GET,OPTIONS, PUT, DELETE"
            }
        }
        return  post(url, formData, config)
        
      }

return (
<main align="left" class="ml-8 mt-8 mr-8">
<form onSubmit={upload}>
<div class="sm:col-span-6">
          <label for="cover-photo" class="block text-sm font-medium text-gray-700">
            Upload and Instantiate a wasm Smart Contract
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">
                WASM Blob up to 25MB
              </p>
            </div>
          </div>
        </div>
</form>
</main>
)}